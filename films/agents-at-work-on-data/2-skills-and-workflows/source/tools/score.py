# Skills and workflows: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 4 November 2026 against every score.py on main and on every branch, and against the series' other films
# (/mnt/project-files/agentic-data-engineering/series-2/palettes.md): an autoharp and a cornett, both made here (music.py has neither).
#  - The autoharp: a box of strings strummed softly with the thumb, while a bar pressed on them damps every string outside one chord.
#    One bar for each of the book's six forms: choosing the bar is the router, and the chord the bar holds sounds the same whoever
#    strums it. A bar lifted, or a new one pressed, damps the strings before another chord sounds.
#  - The cornett: the curved wooden horn of the sixteenth century, played softly, close to a voice, with no vibrato. It is the person
#    who works a problem out by hand: al-Khwarizmi in the opening, Jun doing the job once more, Mei deciding.
#  - The mark: the cornett's phrase, E flat, A flat, B flat, C, then the autoharp's A-flat chord that keeps it: a thing worked out once
#    by hand, then written down. It sounds whole under the book, the title and the last line; in the lab the phrase comes when a person
#    works it out, and the chord when it's written into the skill.
#  - The other marks mean the same all through: the form the steps solve is D flat (the fourth bar), so its steps are D flat's notes,
#    one to a step; a check that holds is a fourth rising (E flat, A flat); one that fails, a semitone falling (D flat, C, or A flat,
#    G); a question, a step rising (E flat, F); two answers for one thing, two different notes, one each side (C and B flat).
#  - A-flat major, F minor for the problem; D flat for the forms and the skill's steps; C minor once, for the book in Latin.
# The rules the series keeps (its briefs, 4 November 2026, as the module's other films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord is tuned pure (just intonation from A flat,
#    see hz()), so A flat, D flat, C minor and F minor are all pure; B flat is never held with F or D flat (their intervals aren't pure
#    here), and the B flats that sound are short. No urgent pulse: the film's turn is a case no skill knows yet, not a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(820)  # this film's own randomness: the room, the thumb, the breath, the paper

# ---- tuning: just intonation from A flat, so a chord's notes are whole-number ratios of each other and nothing beats. A flat, D flat,
# C minor and F minor are pure in this table; B flat with F (40/27) or with D flat (32/27) is not, so those are never held together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (56, 207.652)  # A flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords the bars hold, as the strings a strum crosses, lowest first
AB = (44, 48, 51, 56, 60, 63, 68, 72)   # A flat, from A flat 2 to C 5: home, and the chord that keeps the mark
ABU = (56, 60, 63, 68, 72, 75)          # its upper strings
ABL = (44, 51, 56, 60, 63)              # its lower strings, for the nights
DB = (49, 53, 56, 61, 65, 68, 73)       # D flat: the fourth bar, the form the example's steps solve, and the skill's steps
DBU = (61, 65, 68, 73, 77)              # its upper strings
FM = (41, 44, 48, 53, 56, 60, 65, 68)   # F minor: the problem
FMU = (53, 56, 60, 65, 68, 72)          # its upper strings
CM = (48, 51, 55, 60, 63, 67)           # C minor: the book in Latin
MARK = ((63, 0.38), (68, 0.38), (70, 0.32), (72, 1.5))  # the cornett's phrase: E flat, A flat, B flat, C, the C held

# ---- the levels: the autoharp and the cornett as loud as the module's other music after the author's review of 4 November 2026 (its
# loud moments under -26.5 dB of full scale as one speaker plays the score, tools/quiet.py); the effects well under the music, as low as
# the governance films' (FX scales them all). A string plucked on its own is played a little firmer (PK) than each string of a strum,
# so that one note carries about as well as a chord. With the room set by what it rings where the notes are (below), the cornett is
# 0.8 dB higher, so it's as loud as before, its echo now quieter
AL, CL, PK, FX = 0.058, 0.0438, 1.35, 1.3

# a small room round the players, ringing on for about a second and a quarter, and nothing much above 1.5 kHz. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask: scaled by all it rang, as
# at first, it rang 10 dB louder there than its share said. _room() keeps each note as loud as it was dry, as before
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
# the autoharp's box: broad resonances that colour every string, and little above a kilohertz
BOX = [(190, 120, 0.7), (420, 260, 1.0), (900, 500, 0.5)]
def _box(fk):
    return sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in BOX) + 0.3
def _room(sig, room, tail=None, win=0.4):
    """the room added to a note (its first tail samples, faded at the end when cut short). A held partial meets the room's echo of
    itself, so the room can raise or lower a note by a few decibels, differently for each pitch: the note is brought back to the
    loudness it had dry over its first win seconds, so the room colours it but never moves it"""
    tail = len(_IR) if tail is None else tail
    if not room or tail <= 0:
        return sig
    ir = _IR[:tail].copy(); fo = min(len(ir), int(0.1 * SR)); ir[-fo:] *= np.linspace(1, 0, fo)
    w = int(win * SR); r0 = np.sqrt(np.mean(sig[:w].astype(np.float64) ** 2))
    out = np.pad(sig, (0, tail - 1)) + room * fftconvolve(sig, ir).astype(np.float32)
    r1 = np.sqrt(np.mean(out[:w].astype(np.float64) ** 2))
    return (out * (r0 / r1 if r1 > 0 else 1.0)).astype(np.float32)

# ---- the autoharp: one string plucked by the thumb, near its end. Its partials are harmonic (the strings are thin and long), each
# softer than the last and shaped by the box; the higher ones die first. The bar or the palm damps it after ring seconds. A short note
# (ring 1.5 s or less) stays under two seconds, room and all, so it's never counted as held; a muted one is choked under the palm
def string(m, s, g=1.0, ring=1.6, pan=0.0, room=0.16, mute=False):
    """one string, plucked at s and damped ring seconds later"""
    f = hz(m); sec = ring + 0.16; x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    beta, d1 = (0.17, 0.22 * (200 / f) ** 0.35) if mute else (0.11, 1.5 * (200 / f) ** 0.35)
    ph = R1.uniform(0, 2 * np.pi, 32)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        a = (abs(np.sin(np.pi * k * beta)) + 0.03) / k ** 1.3 * np.exp(-fk / 2000) * _box(fk)
        sig += a * np.sin(2 * np.pi * fk * x + ph[k % 32]) * np.exp(-x * (1 + 0.4 * (k - 1) ** 1.15) / d1)
    sig *= np.minimum(1, x / 0.003) * np.where(x > ring, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.14, 1)) ** 2, 1.0)
    nf = int(0.02 * SR); sig[:nf] += filt(noise(0.02), 'band', (200, 1200))[:nf] * np.exp(-np.arange(nf) / SR / 0.004) * 0.04
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = _room(sig, room, int(min(len(_IR), 1.95 * SR - len(sig))) if ring <= 1.5 else None, min(0.4, ring))
    put(sig.astype(np.float32), s, g * AL, pan)

def strum(ch, s, g=1.0, dt=0.04, ring=2.4, up=False, pan=0.0, spread=0.25, mute=False):
    """a chord strummed with the thumb, from its lowest string (or, up, from its highest), dt apart and a little uneven; every string is
    damped together ring seconds after the first. Its low strings sit a little left of pan, its high ones a little right"""
    ns = tuple(ch)[::-1] if up else tuple(ch); n = len(ns)
    for i, m in enumerate(ns):
        t = s + i * dt * (1 + 0.2 * (R1.uniform() - 0.5))
        w = (0.85 + 0.15 * np.sin(np.pi * i / max(1, n - 1))) * 2.0 / np.sqrt(n)
        string(m, t, g * w, max(0.2, ring - (t - s)), max(-0.85, min(0.85, pan + spread * (m - 60) / 24)), mute=mute)

def ah(m, s, g=1.0, ring=1.6, pan=0.0):
    """a string plucked on its own"""
    string(m, s, g * PK, ring, pan)

def notes(s, ms, step, g=0.55, ring=0.9, last=1.4, pan=0.0):
    """strings plucked one after another, each damped as the next comes; the last rings a little longer"""
    for i, m in enumerate(ms):
        ah(m, s + step * i, g, ring=last if i == len(ms) - 1 else min(ring, step + 0.3), pan=pan)
yes = lambda s, **k: notes(s, (63, 68), 0.3, **k)        # a check that holds: a fourth rising
no1 = lambda s, **k: notes(s, (61, 60), 0.34, **k)       # one that fails: D flat falling to C
no2 = lambda s, **k: notes(s, (56, 55), 0.34, **k)       # or A flat falling to G
ask = lambda s, **k: notes(s, (63, 65), 0.36, **k)       # a question: a step rising, left open

# ---- the cornett, played softly: a lip-blown wooden horn with finger holes, its partials harmonic and soon rounded off by the bore,
# warmest round 650 Hz; each note tongued softly, with a faint breath; held steady (no vibrato), a long note swelling a little, once
def cor(m, a, b, g=1.0, pan=-0.12, room=0.2):
    """one note on the cornett, from a to b"""
    f = hz(m); sec = max(0.12, b - a); att, rel = 0.045, 0.12
    n = int((sec + rel + 0.04) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        ak = k ** -1.35 * (1 + 0.7 * np.exp(-((fk - 650) / 320) ** 2))
        s += ak * np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.4 * (k - 1))), 1)) ** 2 * np.sin(2 * np.pi * fk * x + 0.6 * k)
    if sec >= 1.0:
        s *= 0.86 + 0.14 * np.sin(np.pi * np.clip(x / sec, 0, 1))
    s *= np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    s = s / max(1e-9, float(np.abs(s).max()))
    nt = int(0.03 * SR); s[:nt] += filt(noise(0.03), 'band', (300, 1500))[:nt] * np.exp(-np.arange(nt) / SR / 0.006) * 0.05
    s = s + filt(noise(n / SR + 0.01)[:n], 'band', (400, 1600)) * 0.003 * np.where(x < sec, np.minimum(1, x / att), 0)
    s = _room(filt(s.astype(np.float32), 'low', 2400), room, None, min(0.4, sec))
    put(s.astype(np.float32), a, g * CL, pan)

def phrase(ns, s, g=1.0, pan=-0.12):
    """notes on the cornett, one after another, each tongued: ((note, length), ...)"""
    t = s
    for m, d in ns:
        cor(m, t, t + d - 0.03, g, pan); t += d
    return t

def mark(s, at=None, g=1.0, gs=0.65, ch=AB, ring=3.0, chord=True):
    """the film's mark: the cornett's phrase, worked out by hand, then the autoharp's chord that keeps it (at, by default 0.35 s
    into the held C)"""
    phrase(MARK, s, g)
    if chord:
        strum(ch, s + 1.43 if at is None else at, gs, dt=0.04, ring=ring)

# ---- soft sounds in the room, all low-passed
def knock(s, g=0.018, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled click: a pill coming up, a line lit, the clock's card"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.009, pan=0.0, step=0.2):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.016, pan=0.0, sec=0.45):
    """a sheet or a card laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (250, 1800)), 'low', 2000)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def page(s, g=0.014, pan=0.0, sec=0.9):
    """a page of the book turned: a slower swell of paper"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (200, 1500)), 'low', 1800)[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def pencil(s, g=0.010, pan=0.0, sec=0.6):
    """a pen line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (500, 1800)), 'low', 2000)[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0):
    """something sliding across the frame, or a place opening: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)
def bar(s, g=0.014, pan=0.0):
    """an autoharp bar pressed: a felt pad meeting the strings, a soft, dull click"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.004, g * 0.4 * FX, pan)

# =============================================================================================================================
# 1. Completion and balancing: the opening, where the autoharp may play throughout. Morning on the Tigris: the A-flat chord, strummed
#    slowly. The sums of every day: one string for each kind, rising, each on its own. The law sets each share: D flat. The problem in
#    F minor: each worked its own way, a new kind from nothing (F minor strummed), a slip (F minor choked under the palm), two reckoners
#    and two answers (C on the left, B flat on the right); "Something had to change", and it stops. The book: the cornett's phrase as
#    al-Khwarizmi is named, and the chord that keeps it as the book is said; the two moves, a string each; six forms (the bars, quickly),
#    and the fourth bar pressed: D flat. Its steps, one note each, D flat's; the answer, D flat. The two reckoners again, the same chord
#    each side. Latin: C minor. Algebra and algorithm, a string each. The data team's problem: F minor, softly; written down once: D flat,
#    and a note for each agent; the title on the mark
bw = lambda lid, word, off=0: W('book', lid, word, off)
bc = lambda lid, off=0: G('book', lid, off)
b0 = S0('book')
strum(AB, b0 + 0.5, 0.8, dt=0.11, ring=6.0)
for (w, m, x) in zip(("Estates", "legacies", "fields", "lawsuits", "trade", "land", "canals"), (56, 60, 63, 68, 72, 75, 80),
                     (330, 640, 960, 1250, 1560, 820, 1180)):
    ah(m, bw('kinds', w, -0.15), 0.5, ring=1.2, pan=px(x))
# the courtyard: the estate's card; the law sets each heir's share; a legacy can go outside the family
knock(bc('law'), 0.016, px(840))
strum(DB, bw('law', 'each heir', 0.05), 0.6, dt=0.04, ring=2.8)
knock(bw('law', 'legacy'), 0.016, px(840))
# each worked out its own way: three sheets; a new kind, a blank sheet, from nothing
for i, x in enumerate((220, 372, 520)):
    paper(bc('own', -0.2 + 0.5 * i), 0.012, px(x))
air(bw('own', 'new kind', -0.1), 0.7, 0.009, px(700))
strum(FM, bw('own', 'nothing', -0.1), 0.6, dt=0.05, ring=2.6)
# one slip: her share less than the law gives her
strum(FMU, bw('slip', 'less', -0.15), 0.6, dt=0.03, ring=0.4, mute=True)
# two reckoners, two answers for one estate: a different note each side
ah(60, bw('two', 'two reckoners'), 0.55, ring=2.0, pan=px(535))
ah(58, bw('two', 'two reckoners', 0.4), 0.55, ring=1.6, pan=px(1385))
# the House of Wisdom: the caliph; al-Khwarizmi named, and the cornett's phrase; the book, and the chord that keeps it
tap(bc('writes', 0.1), 0.008, px(1360))
knock(bw('writes', 'Muhammad', -0.1), 0.014, px(1370))
mark(bw('writes', 'Muhammad'), at=bw('writes', 'short book'), g=0.9, gs=0.55, ring=3.2)
paper(bw('require', 'constantly', -0.8), 0.014, px(1370))
# the book open: the two moves, a string each as the problem changes; six forms, the bars quickly; the fourth bar pressed
air(bc('moves', -0.5), 1.0, 0.008)
ah(63, bw('moves', 'completion', 0.5), 0.45, ring=1.0, pan=px(960))
ah(68, bw('moves', 'balancing', 0.6), 0.45, ring=1.0, pan=px(960))
strum(ABU, bw('moves', 'six forms', -0.25), 0.45, dt=0.025, ring=1.0, up=True)
bar(bw('moves', 'six forms', 1.1), 0.014, px(1250))
strum(DB, bw('moves', 'six forms', 1.14), 0.55, dt=0.035, ring=2.4)
# the form's steps; the example; the square drawn
knock(bw('steps', 'example', -0.1), 0.014, px(640))
pencil(bw('steps', 'drawn square'), 0.009, px(1250), 1.2)
# halve, multiply, add, take its root: a note each, D flat's; take away: the root is 3, the chord
for w, m in zip(("Halve", "Multiply", "Add", "Take its root"), (61, 65, 68, 73)):
    ah(m, bw('ex2', w, -0.1), 0.45, ring=1.3, pan=px(640))
strum(DB, bw('ex2', 'Take away', 0.5), 0.55, dt=0.04, ring=2.6, up=True)
# pages of real cases: a page turned, and the legacy's card
page(bc('cases', -0.3), 0.012, px(1100))
knock(bw('cases', 'legacies', -0.2), 0.014, px(960))
# anyone who follows the steps: the same chord, whoever strums it, one reckoner and then the other
strum(DBU, bc('anyone', 0.2), 0.45, dt=0.03, ring=2.4, pan=px(535))
strum(DBU, bc('anyone', 0.6), 0.45, dt=0.03, ring=2.0, pan=px(1385))
# copied for centuries: the years go by; into Latin: C minor, and the card
air(bw('latin', 'copied', -0.3), 2.6, 0.007)
strum(CM, bw('latin', 'Latin', -0.2), 0.5, dt=0.06, ring=3.0, pan=px(1240))
knock(bw('latin', 'Latin', 0.3), 0.014, px(1240))
# the two words: a card each, and a string as each word arrives
knock(bw('words', 'al-jabr', -0.2), 0.012, px(590)); ah(68, bw('words', 'algebra', -0.1), 0.45, ring=1.4, pan=px(1340))
knock(bw('words', 'his own name', -0.2), 0.012, px(590)); ah(72, bw('words', 'algorithm', -0.1), 0.45, ring=1.6, pan=px(1340))
# today: three chats, each from nothing; written down once, and every agent reads it
air(bc('data', -0.5), 0.9, 0.008)
knock(bc('data', 0.1), 0.010, px(400)); knock(bw('data', 'solved again', -0.2), 0.010, px(960))
knock(bw('data', 'solved again', 0.5), 0.010, px(1520))
strum(FMU, bw('data', 'from nothing', -0.1), 0.4, dt=0.05, ring=1.8)
paper(bw('reuse', 'write it down', -0.2), 0.014, px(960))
strum(DB, bw('reuse', 'write it down'), 0.5, dt=0.035, ring=2.0)
for i, m in enumerate((68, 72, 75)):
    ah(m, bw('reuse', 'every agent', 0.2 * i), 0.4, ring=1.4, pan=px((560, 960, 1360)[i]))
# the title card: the mark
mark(bc('breath', 0.1), g=0.75, gs=0.5, ring=4.0)

# 2. Solved again, from nothing: F minor at the turn. The count's card, the report's; they match; then 37 fewer: why? D flat falls to
#    C. The three causes, a string each, F minor's; each answer flies off to where it stayed; the agent starts from nothing: F minor
#    choked; two afternoons, two answers: C on the left, B flat on the right, as the two reckoners had
aw = lambda lid, word, off=0: W('again', lid, word, off)
ac = lambda lid, off=0: G('again', lid, off)
strum(FM, S0('again') + 0.3, 0.5, dt=0.06, ring=2.6)
knock(aw('today', '18,412', -0.3), 0.016, px(1350))
tap(aw('today', 'government', -0.4), 0.008, px(1350))
knock(ac('recon', -0.2), 0.014, px(490)); tap(aw('recon', 'code', -0.2), 0.008, px(490))
knock(aw('matches', 'census report', -0.3), 0.014, px(1430))
tap(aw('matches', 'still matches', 0.3), 0.010, px(960))
no1(aw('differ', 'why', -0.3), g=0.5, pan=px(960))
for w, m in zip(('withdrew', 'new degree', 'counted twice'), (53, 56, 60)):
    ah(m, aw('three', w, -0.2), 0.55, ring=2.2, pan=px(960))
for w, x in zip(('one chat', 'one note', 'one email'), (400, 960, 1520)):
    air(aw('stayed', w, -0.2), 0.9, 0.009, px(x))
strum(FMU, aw('nothing', 'starts from nothing'), 0.6, dt=0.05, ring=0.4, mute=True)
ah(60, ac('twice'), 0.5, ring=2.0, pan=px(520))
ah(58, aw('twice', 'another way', -0.1), 0.5, ring=2.0, pan=px(1400))

# 3. A skill, earned by hand: Jun does the job once more, and the cornett's phrase comes as he works it out; the skill: the autoharp's
#    A-flat chord keeps it. Its steps typed in; its causes, a card each; the seven skills, folded; a job needs one, and its steps unfold:
#    one string. A new case gets a line: written in; nothing is solved twice: a fifth rising. The book again: D flat
sw = lambda lid, word, off=0: W('skill', lid, word, off)
sc_ = lambda lid, off=0: G('skill', lid, off)
mark(sw('hand', 'by hand'), g=0.8, chord=False)
pencil(sw('hand', 'writes down'), 0.009, px(1300), 1.4)
paper(sw('file', 'a skill', -0.2), 0.014, px(960))
strum(AB, sw('file', 'a skill', 0.2), 0.55, dt=0.04, ring=2.6)
tap(sw('file', 'a name', -0.1), 0.008, px(700)); tap(sw('file', 'a line', -0.1), 0.008, px(900))
keys(sc_('steps', 0.1), 4, 0.008, px(960), 0.2)
for i in range(3):
    knock(sc_('causes', -0.2 + 0.3 * i), 0.012, px(960))
air(sc_('loads', -0.2), 1.0, 0.008, px(960))
tap(sw('loads', 'a job', -0.4), 0.008, px(330))
paper(sw('loads', 'a job', 0.3), 0.012, px(1250))
ah(63, sw('loads', 'a job', 0.6), 0.45, ring=1.4, pan=px(1250))
pencil(sw('grows', 'new case', -0.1), 0.009, px(960), 0.8)
notes(sw('grows', 'Nothing is solved', -0.1), (56, 63), 0.32, g=0.5)
strum(DB, sc_('book', 0.3), 0.5, dt=0.04, ring=2.4)

# 4. A router picks the skill: the seven skills; the job; the router, a skill whose only job is to choose: a bar pressed; it reads the
#    job and each line, and loads the one that fits: the bar pressed, and D flat. A job no skill fits: A flat falls to G; asked of a
#    person; done by hand: the cornett, falling home. The book's two moves: the first problem to the first bar, A flat, the second to
#    the fourth, D flat
rw = lambda lid, word, off=0: W('router', lid, word, off)
rc = lambda lid, off=0: G('router', lid, off)
air(rw('seven', 'seven skills', -0.3), 1.2, 0.008, px(960))
knock(rc('which', -0.2), 0.014, px(330))
knock(rc('router', -0.2), 0.012, px(330))
bar(rw('router', 'only job'), 0.012, px(330))
bar(rw('reads', 'loads the one'), 0.014, px(960))
strum(DB, rw('reads', 'loads the one', 0.05), 0.5, dt=0.035, ring=2.4)
knock(rc('none', -0.3), 0.014, px(330))
no2(rw('none', 'says so', -0.3), g=0.5, pan=px(1240))
knock(rw('none', 'asks a person', -0.2), 0.012, px(1010))
knock(rc('next', -0.2), 0.012, px(1270))
phrase(((72, 0.4), (70, 0.4), (68, 1.1)), rw('next', 'by hand'), 0.75)
pencil(rw('next', 'next skill', -0.2), 0.008, px(1270), 0.7)
knock(rw('forms', 'brought each problem', -0.4), 0.012, px(600)); knock(rw('forms', 'brought each problem', 0.4), 0.012, px(1265))
bar(rw('forms', 'brought each problem', 0.88), 0.012, px(600))
strum(ABU, rw('forms', 'brought each problem', 0.9), 0.45, dt=0.03, ring=0.6)
bar(rw('forms', 'brought each problem', 1.58), 0.012, px(1265))
strum(DB, rw('forms', 'brought each problem', 1.6), 0.5, dt=0.035, ring=2.4)

# 5. A workflow runs what's known: night, the low A-flat strings, slowly. The clock; the day's records, the count. The rail of fixed
#    steps; Build, Count as on census day, Run the tests, Compare: a string each, rising. They agree: a click. The rule's two cards. They
#    don't agree: D flat falls to C; the step that calls the agent, the skill, the draft; a person decides: the cornett, one note. The book:
#    the problem brought to its form, the fourth bar pressed, D flat
ww = lambda lid, word, off=0: W('workflow', lid, word, off)
wc = lambda lid, off=0: G('workflow', lid, off)
strum(ABL, S0('workflow') + 0.3, 0.5, dt=0.09, ring=3.0)
tap(ww('night', 'Every night', -0.2), 0.008, px(960))
knock(ww('night', "day's records", -0.6), 0.012, px(540)); knock(ww('night', 'built again', -0.3), 0.012, px(1380))
air(ww('fixed', 'workflow', -0.3), 1.2, 0.008)
for w, m, i in zip(('Build', 'Count as', 'Run the tests', 'Compare'), (56, 60, 63, 68), range(4)):
    ah(m, ww('list', w, -0.1), 0.45, ring=1.4 if i < 3 else 1.6, pan=px(330 + 370 * i + 185))
tap(wc('agree', -0.3), 0.010, px(960))
knock(ww('rule', 'plain steps', -0.3), 0.012, px(960)); knock(ww('rule', 'keep the agent', -0.2), 0.012, px(960))
no1(ww('call', "don't agree", -0.2), g=0.5, pan=px(1300))
knock(ww('call', 'one more step', -0.3), 0.012, px(1640))
knock(ww('call', 'reconcile skill', -0.3), 0.012, px(1000))
paper(ww('person', 'finds out why', -0.2), 0.012, px(1000))
cor(68, ww('person', 'A person decides', -0.2), ww('person', 'A person decides', 1.1), 0.75)
bar(ww('book', 'bringing', 0.9), 0.012, px(920))
strum(DB, ww('book', 'bringing', 0.92), 0.5, dt=0.035, ring=2.4, up=True)

# 6. One night, a new case: F minor at the turn, strummed from the top. The clock, the two numbers. The tests pass; the agent called. The
#    skill, its causes checked one by one, none fits: A flat falls to G. The query tool, the reach, fourteen records. The draft in the
#    sandbox, its lines; "Are these students?": a step rising, left open. In the morning Mei decides: the cornett's phrase; Jun adds her
#    answer to the skill: the autoharp's chord that keeps it. One more fixed step: a bar pressed; its test; Noor approves. The next night,
#    the five steps run, a string each, and the count matches: home
nw = lambda lid, word, off=0: W('night', lid, word, off)
nc = lambda lid, off=0: G('night', lid, off)
strum(FM, S0('night') + 0.3, 0.5, dt=0.06, ring=2.8, up=True)
tap(nw('one', 'October', -0.3), 0.008, px(1560))
knock(nw('one', '18,426', -0.3), 0.014, px(520)); knock(nw('one', '18,412', -0.2), 0.014, px(1100))
tap(nw('tests', 'pass', -0.2), 0.010, px(1100))
knock(nw('tests', 'calls the agent', -0.2), 0.012, px(1640))
knock(nw('loads', 'reconcile skill', -0.3), 0.012, px(1280))
for i in range(3):
    tap(nw('loads', 'checks the causes', 0.3 * i), 0.007, px(1280)); tap(nw('loads', 'one by one', 0.55 * i), 0.009, px(1750))
no2(nw('loads', 'None fits', -0.2), g=0.5, pan=px(1280))
knock(nc('finds', -0.3), 0.012, px(1520)); air(nc('finds'), 0.9, 0.008, px(900)); tap(nc('finds', 0.6), 0.008, px(1300))
knock(nw('finds', 'fourteen', -0.2), 0.014, px(1240))
paper(nw('drafts', 'drafts a report', -0.3), 0.014, px(1120))
pencil(nw('drafts', 'the cause', -0.2), 0.008, px(1000), 0.6); pencil(nw('drafts', 'the query', -0.2), 0.008, px(1000), 0.5)
ask(nw('drafts', 'Are these', -0.3), g=0.45, pan=px(1120))
tap(nc('mei', -0.2), 0.008, px(1600))
knock(nw('mei', 'test records', -0.4), 0.014, px(570))
mark(nw('mei', 'decides'), g=0.8, chord=False)
knock(nc('adds', 0.1), 0.012, px(1290))
strum(AB, nw('adds', "Mei's answer", -0.2), 0.55, dt=0.04, ring=2.8)
bar(nw('adds', 'fixed step', -0.1), 0.012, px(700))
tap(nw('adds', 'with a test', -0.1), 0.008, px(700))
knock(nw('noor', 'approves', -0.3), 0.014, px(1110))
tap(nc('next', -0.2), 0.008, px(1560))
notes(nc('next'), (56, 58, 60, 63, 68), 0.48, g=0.42, ring=1.0, last=1.6, pan=px(960))
yes(nc('next', 2.6), g=0.4, pan=px(960))

# 7. Solve it once: Baghdad again, D flat strummed from the top. His steps followed for centuries: a card. A skill, a router, a workflow:
#    a card each, the router's a bar; the same way every night. The agent called only where thinking is needed: a string; a person
#    decides: the cornett. Each new case written down. The last line on the mark: the cornett's phrase, the chord as it's written down,
#    a string for each agent that reuses it; the end card on the low A-flat strings
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
strum(DB, S0('close') + 0.3, 0.5, dt=0.07, ring=3.0, up=True)
knock(cw('baghdad', 'followed', -0.3), 0.012, px(1380))
knock(cw('uni', 'a skill', -0.2), 0.012, px(400)); bar(cw('uni', 'A router', -0.2), 0.012, px(960))
knock(cw('uni', 'A workflow', -0.2), 0.012, px(1520)); tap(cw('uni', 'every night', -0.3), 0.008, px(960))
air(cc('agent', -0.3), 1.0, 0.008)
ah(75, cw('agent', 'thinking', -0.3), 0.4, ring=1.4, pan=px(1580))
cor(68, cw('agent', 'a person decides', -0.2), cw('agent', 'a person decides', 1.1), 0.7)
air(cc('new', -0.3), 0.9, 0.008); pencil(cw('new', 'written down', -0.3), 0.008, px(960), 0.7); tap(cw('new', 'never solved'), 0.008, px(960))
mark(cc('once', -0.4), at=cw('once', 'write it down'), g=0.8, gs=0.5, ring=2.6)
for i, m in enumerate((72, 75, 80)):
    ah(m, cw('once', 'reuse it', -0.2 + 0.2 * i), 0.38, ring=1.4, pan=px((560, 960, 1360)[i]))
strum(ABL, cc('breath', 0.6), 0.5, dt=0.1, ring=4.0)
