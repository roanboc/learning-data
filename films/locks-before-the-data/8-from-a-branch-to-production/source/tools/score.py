# From a branch to production: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked on 5 November 2026 against every score.py on main and on every branch, and against
# every palettes list in the project's working folders (the module's palettes.md, 13:06 UTC): a chamber barrel organ and a bandora,
# both made here (music.py has neither).
#  - The chamber barrel organ leads: a small pipe organ, as English parish churches had in the early 1800s, whose tunes are pinned on a
#    wooden barrel. Turning its handle works the bellows and turns the barrel, and the pins open the pipes, so whoever turns it can't
#    change a note. Stopped wooden pipes, soft and round, no tremulant; a little wind as each pipe opens; every note exactly on its pin.
#    It is the path: what was pinned and checked is what plays. Its mark, a short phrase in E-flat major (B flat, E flat, G, F, E flat,
#    on the home chord), plays exactly the same each time a reviewed change is released: the certified text in 1996, the deploy Noor
#    let through, and the job at two that runs it.
#  - The bandora, the wire-strung bass of the English consort (London, 1562), plucked softly with the fingers, low and plain: the people
#    who review. Each review is one note (the Court's look, Sam's, Noor's, and someone who didn't write the change); two notes that
#    agree, a fifth, where a person says yes. Never for a machine, never for a check.
#  - E-flat major, tuned pure from E flat, for the path; C minor under the problem (the fears of 1993, "Not certified", the door with no
#    gate). A held chord gives way where the next begins. No E-flat chord with a low D, nor an A flat with a low G: a semitone apart
#    down there, they would beat.
# The rules the module keeps (its briefs, 5 November 2026):
#  - Music only from time to time: under the opening story (Principles first and Sent back, to the title), and after it only at a
#    chapter's turn, under a moment on screen (the ruleset's last tick, "Approved · the last push", Noor's yes, the lock that lights,
#    the pins) or in a pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord tuned pure (just intonation from E flat, see
#    hz()). No urgent pulse: nothing in this story is a breach or a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (nine marks, seven
#    blocks of seats, four gates) is one soft sound, never one for each.
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
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1996)  # this film's own randomness: the church, the wind, the paper

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E-flat major
# (E flat G B flat), A-flat major (A flat C E flat), B-flat major (B flat D F), C minor (C E flat G) and G minor (G B flat D) are all
# pure in this table; F with C or with A flat is not (40/27 and 32/27), so no F minor chord, and F sounds only with B flat and D
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Eb2, G2, Ab2, Bb2, C3, D3, Eb3, F3, G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4 = 39, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70
MARK = (Bb3, Eb4, G4, F4, Eb4)   # the pinned tune, played only where a reviewed change is released

# ---- the levels, set so the music's loud moments sit about -28 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the bandora a little over the organ, as one plucked string; the
# effects about 16 dB under the music (FX scales them all)
OL, BL, FX = 0.042, 0.050, 1.4

# a room round the players: a small parish church, ringing on for about a second and a half, nothing much above 1.8 kHz. Its level is
# set by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level
# in it (_held), as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.025 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the chamber barrel organ: stopped wooden pipes, so the odd harmonics sound and the even ones hardly; soft and round, nothing
# above 2.2 kHz. A pin opens a pipe's pallet at a and lets it close at b: the pipe speaks in about 40 ms (its higher harmonics a
# moment later), with a little wind as it opens, and stops in under a tenth of a second. Held steady, no tremulant, nothing swells:
# the handle works the bellows at one pressure. att longer than the pipe's own (0.04 s) is the handle starting to turn, under the
# opening only
def organ(m, a, b, g=1.0, pan=0.0, att=0.04, room=0.38):
    f = hz(m); sec = max(0.12, b - a); rel = 0.09; n = int((sec + rel + 0.02) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k, w in ((1, 1.0), (2, 0.035), (3, 0.17), (5, 0.055), (7, 0.02)):
        if f * k > 2200:
            continue
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2
        s = s + w * on * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    s = s * np.where(x > sec, np.cos(0.5 * np.pi * np.clip((x - sec) / rel, 0, 1)) ** 2, 1.0)
    s = s / max(1e-9, float(np.abs(s).max()))
    lo, hi = max(220.0, 1.5 * f), min(2000.0, 3.5 * f)
    wind = filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)) * (0.05 * np.exp(-x / 0.025) + 0.005) * np.where(x < sec, 1.0, np.exp(-(x - sec) * 40))
    put(_held(filt((s + wind).astype(np.float32), 'low', 2200), room), a, g * OL, pan)
def chord(notes, a, b, g=1.0, pan=0.0, att=0.04, spread=0.3):
    """the barrel's pins open these pipes together at a and let them close at b"""
    k = len(notes)
    for i, m in enumerate(notes):
        organ(m, a, b, g * (1.0 if i == 0 else 0.82) / np.sqrt(max(1, k) / 2.0), pan + spread * (i / max(1, k - 1) - 0.5), att)
def pins(notes, s, step, g=1.0, pan=0.0, last=1.2):
    """notes one after another, each exactly on its pin, the last held"""
    for i, m in enumerate(notes):
        organ(m, s + i * step, s + i * step + (last if i == len(notes) - 1 else step * 0.84), g, pan)
def mark(s, g=1.0, pan=0.0):
    """the pinned tune: five notes exactly a step apart, the last held over the home chord. The same, note for note, every time"""
    step = 0.36; pins(MARK[:-1], s, step, g, pan)
    t = s + 4 * step; organ(MARK[-1], t, t + 1.8, g, pan); chord((Eb3, G3, Bb3), t, t + 1.8, g * 0.75, pan)
    return t + 1.8

# ---- the bandora: wire strings over a wide body, plucked softly with the fingertips about a fifth of the way along (so its fifth
# harmonic hardly sounds), low and plain. Wire rings longer and a touch brighter than gut, its harmonics a hair sharp; the body warms
# it near 230 Hz; the fingertip's touch is a small, soft thump. Nothing trembles
def bandora(m, s, g=1.0, pan=-0.2, room=0.25):
    f = hz(m); ring = 2.4 if f < 110 else 1.9; sec = min(5.0, ring * 2.0); x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    for k in range(1, 40):
        fk = f * k * np.sqrt(1 + 6e-5 * k * k)
        if fk > 2300:
            break
        a = abs(np.sin(np.pi * k * 0.2)) / k * (1 + 0.5 * np.exp(-((fk - 230) / 110) ** 2))
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.5 * k) * np.exp(-x * (1 + 0.5 * (k - 1)) / ring)
    sig = sig * np.minimum(1, x / 0.005)
    nt = int(0.025 * SR); sig[:nt] += filt(noise(0.025)[:nt], 'band', (120, 900)) * np.exp(-np.arange(nt) / SR / 0.006) * 0.08
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.15) / 0.15, 0, 1)) ** 2
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    put(_held(filt(sig.astype(np.float32), 'low', 2300), room), s, g * BL, pan)
def agree(lo, s, g=1.0, pan=-0.2):
    """a person says yes: two strings plucked together, a fifth apart"""
    bandora(lo, s, g, pan); bandora(lo + 7, s + 0.04, g * 0.8, pan + 0.12)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card or a pill set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled key: a tick, a line picked out"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a page laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def slide(s, g=0.010, pan=0.0, sec=0.5):
    """a row or a pill slid along glass: a soft brush, and its small stop"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
    s_knock(s + sec * 0.85, g * 0.5 * FX, pan, 330)
def strike(s, g=0.009, pan=0.0, sec=0.45):
    """lines struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def pen(s, sec=0.7, g=0.007, pan=0.0):
    """a signature: a pen's soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def stamp(s, g=0.018, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, or a line drawn"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def unlock(s, g=0.010, pan=0.0):
    """a small lock opening: its bolt drawn back"""
    s_tap(s, g * 0.6 * FX, pan); s_knock(s + 0.04, g * 0.8 * FX, pan, 360)
def click(s, g=0.012, pan=0.0):
    """a button pressed: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def switch(s, g=0.011, pan=0.0):
    """a small switch thrown"""
    s_knock(s, g * FX, pan, 520); s_tap(s + 0.01, g * 0.5 * FX, pan)
def book(s, g=0.012, pan=0.0):
    """a bound text closed: its pages, and its cover meeting them"""
    paper(s, g * 0.8, pan, 0.35); s_knock(s + 0.32, g * FX, pan, 180)

# =============================================================================================================================
# 1. Principles first: South Africa, 1993, with music all through it.
#    The negotiating table at night: the home chord, E-flat major, as the handle starts to turn; the parties must agree: A-flat major.
#    April 1994, the queue at dawn: B flat's notes rising, one pin at a time, and its chord. The seats lit block by block: one soft
#    swell and E-flat major. What the smaller parties fear: C minor, a knock as each card comes; what the larger won't accept: G minor.
#    "Something has to change": C minor held. The principles first: E-flat major as the tablet rises; a tap for each of its two lines
#    named. "Nobody may change them": the lock, and A flat to E flat, an amen. The Assembly: B-flat major as its seats light. The
#    Court, which didn't write it: the text set down, A flat, and B flat waiting
PR = lambda lid, word, off=0: W('principles', lid, word, off)
p0 = S0('principles')
chord((Eb3, G3, Bb3), p0 + 0.4, G('principles', 'apartheid', 0.0), 0.8, att=0.6)
chord((Ab2, Eb3, C4), G('principles', 'apartheid', 0.3), END('principles', 'apartheid') - 1.2, 0.7, att=0.5)
tV = PR('vote', 'all South Africans', -0.2)
pins((Bb3, D4, F4, Bb4), tV, 0.5, 0.55, px(980), last=0.6)
chord((Bb2, F3, D4), tV + 2.0, END('principles', 'vote') + 0.6, 0.6)
air(G('principles', 'seats', 1.0), 2.2, 0.007, px(600), 160, 800)
chord((G3, Bb3, Eb4), G('principles', 'seats', 0.8), END('principles', 'seats') + 0.4, 0.6)
tF = PR('fear', 'rights a later', -0.2)
chord((C3, G3, Eb4), G('principles', 'fear', -0.2), G('principles', 'elected', -0.3), 0.7, att=0.3)
knock(tF + 0.05, 0.013, px(1250), 200); knock(PR('fear', 'courts', -0.15), 0.013, px(1250), 200)
knock(PR('elected', 'negotiators', -0.35), 0.013, px(1250), 200)
chord((G2, Bb3, D4), G('principles', 'elected', -0.2), END('principles', 'elected') + 0.3, 0.65, att=0.3)
chord((C3, Eb3, G3, C4), G('principles', 'change', -0.2), G('principles', 'first', 0.1), 0.7, att=0.4)
tP = G('principles', 'first', 0.2)
chord((Eb3, Bb3, G4), tP, G('principles', 'fixed', 0.2), 0.7, att=0.15)
knock(tP + 1.0, 0.014, px(960), 240)
tap(PR('first', 'rights for', -0.1), 0.008, px(400)); tap(PR('first', 'judges', -0.1), 0.008, px(1500))
knock(PR('fixed', 'temporary', -0.2), 0.012, px(960), 260)
tN = PR('fixed', 'nobody may', -0.2)
lock(tN + 0.1, 0.011, px(800))
chord((Ab2, Eb3, C4), tN, tN + 1.3, 0.65); chord((Eb3, G3, Bb3, Eb4), tN + 1.3, G('principles', 'assembly', -0.4), 0.7)
chord((Bb2, F3, Bb3, D4), G('principles', 'assembly', 0.2), END('principles', 'assembly') + 0.5, 0.6, att=0.3)
tap(PR('assembly', 'Constitutional Assembly', -0.3), 0.008, px(560))
paper(G('principles', 'court', -0.2), 0.010, px(430), 0.4)
chord((Ab2, Eb3, C4), PR('court', 'which', -0.3), PR('court', 'certifies', -0.1), 0.6, att=0.3)
air(PR('court', 'certifies', -0.2), 1.6, 0.007, px(1000), 180, 900)
chord((Bb2, F3, D4), PR('court', 'certifies', 0.0), G('sent', 'adopts', 0.3), 0.6, att=0.3)

# 2. Sent back: adopted in May 1996: E-flat major and a knock for its card. The text glides to the bench: a breath of air. The Court
#    looks: one bandora note; "Not certified": the stamp, low, and C minor. The nine respects: one soft rustle for all nine. Two of them,
#    each card a knock, over G minor. In five weeks: B flat swells as the marks turn green, one soft sound for all nine; the amended
#    text's card, and A flat as it glides back. "The Court certifies it": the stamp, the judges' yes (a fifth on the bandora) and the
#    mark, the pinned tune, for the first time. Signed: the pen; in force: its slip; E-flat major held. Still the constitution: the
#    text closed. Every side could trust it: E-flat major as the Assembly and the Court light together. The three lessons, a knock as
#    each comes, over A flat, B flat and home. A change to production: B flat, and the title on the home chord, with the organ's low
#    E flat under it
SE = lambda lid, word, off=0: W('sent', lid, word, off)
s0 = S0('sent')
chord((Eb3, G3, Bb3, Eb4), G('sent', 'adopts', 0.4), SE('adopts', 'members', 0.6), 0.6)
knock(s0 + 0.95, 0.014, px(960), 240)
air(SE('adopts', 'members', 0.6), 2.2, 0.008, px(900), 160, 800)
bandora(G2, SE('declines', 'all agreeing', -0.1), 0.8, px(1430))
tD = SE('declines', 'decline')
stamp(tD + 0.05, 0.017, px(1560))
chord((C3, G3, Eb4), tD + 0.1, G('sent', 'nine', 1.6), 0.65, att=0.2)
paper(G('sent', 'nine', 0.25), 0.008, px(1430), 0.6)
chord((G2, Bb3, D4), G('sent', 'rights', -0.1), G('sent', 'weeks', -0.2), 0.55, att=0.3)
knock(G('sent', 'rights', 0.05), 0.012, px(900), 200); knock(G('sent', 'officials', 0.05), 0.012, px(900), 200)
air(G('sent', 'weeks', 0.3), 2.2, 0.008, px(700), 160, 800)
tFx = SE('weeks', 'fixes', 0.3)
chord((Bb2, F3, D4), tFx, tFx + 3.9, 0.6, att=1.0)
knock(SE('weeks', 'amended', -0.15), 0.013, px(900), 240)
chord((Ab2, Eb3, C4), SE('weeks', 'amended', 0.6), G('sent', 'certifies', -0.1), 0.55, att=0.3)
tC = SE('certifies', 'certifies')
stamp(tC + 0.05, 0.017, px(1560))
agree(Eb2, tC + 0.08, 0.85, px(1430))
tM = mark(tC + 0.3, 0.9)
pen(SE('signs', 'signs', -0.05), 0.7, 0.006, px(1430))
chord((Bb2, Eb3, G3), tM + 0.05, G('sent', 'still', -0.4), 0.55)
knock(SE('signs', 'comes into force', -0.15), 0.011, px(1000), 260)
book(G('sent', 'still', 0.9), 0.011, px(960))
chord((Eb3, G3, Bb3, Eb4), G('sent', 'trust', 0.4), END('sent', 'trust') + 0.4, 0.6, att=0.3)
for w_, x_ in (('judges', 1270), ('promises', 130), ('counted', 700)):
    knock(SE('both', w_, -0.25), 0.012, px(x_ + 260), 240)
chord((Ab2, Eb3, C4), SE('both', 'judges', -0.3), SE('both', 'counted', -0.35), 0.55)
chord((Bb2, F3, D4), SE('both', 'counted', -0.3), END('sent', 'both') + 0.3, 0.55)
chord((Eb3, Bb3, G4), END('sent', 'both') + 0.35, G('sent', 'same', -0.2), 0.5)
chord((Bb2, F3, Bb3), G('sent', 'same', 0.0), G('sent', 'breath', 0.2), 0.55, att=0.3)
tT = G('sent', 'breath', 0.3)
chord((Eb2, Bb2, Eb3, G3, Bb3), tT, E('sent') + 0.2, 0.8, att=0.4)

# =============================================================================================================================
# After the opening, music only from time to time.
# 3. No gate yet: the job at two (its slip, a tap; its records, a breath); the three rooms lit in turn, a tap for each; the tags from
#    the films before, set down; the badge. "But nothing guards the way in": C minor, briefly. GitHub's page, the line from main
#    straight to production; the team, their lines; the door with no gate, a low knock; the leak; the stolen sign-in. "One way in,
#    with a gate": the track lays itself as four pins rise, E flat to E flat
NG = lambda lid, word, off=0: W('nogate', lid, word, off)
air(NG('job', 'loads', 0.2), 2.6, 0.007, px(1646), 160, 800)
tap(NG('job', 'two', -0.4), 0.008, px(1600))
for w_, x_ in (('development', 805), ('test', 1195), ('production', 1646)):
    tap(NG('walls', w_, -0.2), 0.008, px(x_))
knock(G('nogate', 'walls', 0.4), 0.011, px(900), 260)
knock(G('nogate', 'key', 0.3), 0.011, px(900), 260)
tap(NG('key', 'no secret', -0.2), 0.008, px(860))
knock(NG('key', 'own identity', -0.5), 0.012, px(930), 240)
chord((C3, Eb3, G3), G('nogate', 'guards', -0.1), G('nogate', 'guards', 2.1), 0.6, att=0.2)
paper(NG('main', 'GitHub', -0.4), 0.010, px(265), 0.4)
air(NG('main', 'goes straight', -0.2), 1.6, 0.008, px(1000), 160, 800)
knock(G('nogate', 'anyone', -0.2), 0.010, px(150), 220)
air(NG('anyone', 'push', -0.2), 1.0, 0.006, px(250), 200, 900)
knock(NG('anyone', 'nobody else', 0.0), 0.013, px(1646), 150)
air(NG('unread', 'send', 0.2), 1.4, 0.008, px(1800), 140, 700)
knock(NG('stole', 'stole', -0.2), 0.012, px(70), 160)
tW = NG('gate', 'one way in')
pins((Eb3, G3, Bb3, Eb4), tW, 0.55, 0.6, px(1000), last=1.4)
tap(tW + 0.6, 0.008, px(440))

# 4. Rules first: the first lesson lit, one pipe (E flat). GitHub's ruleset, a page laid down; a tap as each rule is ticked, and at the
#    last tick a short chord, E-flat major. Nobody may bypass it: its pill. The code owners file: its tag, its two lines, "Read from
#    main"; the copy in a pull request, "Not read", a low knock; the card "In Settings". Back in the hall the gates stand up one by one:
#    three pins rising, B flat, E flat, G
RU = lambda lid, word, off=0: W('rules', lid, word, off)
organ(Eb4, RU('sets', 'principles', 0.4), RU('sets', 'principles', 1.9), 0.55, px(1500))
paper(G('rules', 'ruleset', -0.3), 0.010, px(650), 0.4)
for w_ in ('pull request', 'rewrites', 'deletes'):
    tap(RU('ruleset', w_, 0.0), 0.008, px(200))
tap(RU('owner', 'code owner', 0.0), 0.008, px(200)); tap(RU('owner', 'last push', 0.0), 0.008, px(200))
tLt = G('rules', 'checks', 0.3)
tap(tLt, 0.008, px(200))
chord((Bb3, Eb4, G4), tLt + 0.05, tLt + 1.9, 0.5)
knock(RU('bypass', 'nobody', 0.0), 0.012, px(900), 240)
paper(G('rules', 'decides', 0.3), 0.010, px(650), 0.4)
knock(RU('decides', 'Who decides', -0.2), 0.010, px(250), 260)
tap(RU('file', 'platform team', -0.2), 0.008, px(400)); tap(RU('both', 'data governance', -0.2), 0.008, px(400))
knock(RU('reads', 'from main', 0.0), 0.011, px(300), 260)
paper(RU('reads', 'not from', -0.2), 0.009, px(390), 0.3)
knock(RU('reads', 'not from', 0.9), 0.012, px(560), 160)
knock(RU('loosen', 'in the code', -0.2), 0.012, px(980), 240)
tBk = min(END('rules', 'loosen') + 0.5, E('rules') - 1.8)
pins((Bb2, Eb3, G3), tBk + 0.3, 0.35, 0.55, px(800), last=1.6)

# 5. Sent back, fixed, checked again: the row the load couldn't read, a low knock; Jun's admin account, the amber switch; the row slid
#    aside; his branch drawn up to development; his copy's page; "Made-up records". The pull request laid down; the two checks ticked
#    (machines: no bandora). Sam reviews: one bandora note. The line that logs names: its slip, the log's card. Changes requested: one
#    low note. The line struck through, the new commit; "Approved · the last push": Sam's yes, a fifth on the bandora. The second
#    lesson lit: one pipe (G). Merged: its button, its pill
RV = lambda lid, word, off=0: W('review', lid, word, off)
knock(RV('morning', "couldn't read", -0.2), 0.012, px(1646), 160)
switch(RV('switched', 'admin account', -0.4), 0.010, px(980))
slide(RV('aside', 'aside', 0.0), 0.009, px(1500), 0.9)
air(RV('branch', 'branch', -0.2), 1.4, 0.007, px(620), 180, 900)
paper(RV('branch', 'development', 0.2), 0.010, px(795), 0.4)
tap(RV('branch', 'made-up records', -0.2), 0.008, px(500))
paper(G('review', 'opens', -0.2), 0.011, px(650), 0.4)
tap(RV('run', 'tests', 0.6), 0.008, px(250)); tap(RV('run', 'code scanning', 0.9), 0.008, px(250))
bandora(Bb2, G('review', 'sam', 0.1), 0.8, px(1660))
knock(RV('line', 'names and all', -0.2), 0.012, px(800), 240)
knock(G('review', 'log', 0.3), 0.012, px(930), 240)
bandora(C3, G('review', 'asks', 0.3), 0.75, px(1660))
strike(RV('again', 'takes it out', 0.0), 0.008, px(400))
tap(RV('again', 'pushes again', 0.0), 0.008, px(200))
agree(Bb2, RV('again', 'approves', 0.0), 0.85, px(1660))
organ(G4, G('review', 'fixed', 0.3), G('review', 'fixed', 1.8), 0.5, px(1500))
click(G('review', 'merges', 0.2), 0.011, px(300))
knock(G('review', 'merges', 0.9), 0.012, px(200), 260)

# 6. The key fits one door: the branch joins main, a breath; production's lock set on its door. GitHub's machine slides in, inside the
#    university's network; its tag; the private path drawn; the tag from Network, storage and keys. The run: a page; the test sign-in,
#    the bundle's card, the run on test's records, and test passes (taps and knocks: machines). Production waits, in silence. The box
#    that asks: its two pills. Noor looks: one bandora note, a tap as each of the other two things she sees is ticked; she approves: the
#    button, and her yes, a fifth. The note for one sign-in travels to the door; the lock lights: one pipe (E flat); the note from
#    another branch is stopped, a low knock. The lock opens, and the mark plays, the pinned tune: released. Databricks' page; "Can
#    view". Two people said yes and a machine did the rest: E-flat major as the gates light, and the third lesson lit (B flat)
DR = lambda lid, word, off=0: W('door', lid, word, off)
air(G('door', 'merging', -0.2), 1.4, 0.006, px(440), 180, 800)
lock(DR('merging', 'production', 0.1), 0.010, px(1646))
air(DR('runner', 'machines', -0.2), 1.2, 0.008, px(150), 160, 800)
knock(DR('runner', 'machines', 0.6), 0.011, px(560), 260)
air(DR('private', 'private path', -0.1), 1.8, 0.007, px(900), 180, 900)
knock(DR('private', 'Network', -0.2), 0.010, px(1300), 260)
paper(G('door', 'test', -0.2), 0.011, px(650), 0.4)
tap(DR('signs', 'registrar loader test', -0.3), 0.008, px(220))
knock(DR('signs', 'bundle', -0.2), 0.012, px(840), 240)
tap(DR('signs', 'runs the job', 0.0), 0.008, px(220))
tap(G('door', 'passes', 0.0), 0.009, px(200))
paper(G('door', 'self', -0.25), 0.010, px(620), 0.35)
tap(DR('self', "can't approve", -0.2), 0.008, px(260)); tap(DR('self', 'only main', -0.2), 0.008, px(560))
bandora(Ab2, DR('noor', 'what changed', -0.2), 0.75, px(1660))
tap(DR('noor', 'who reviewed', -0.2), 0.008, px(180)); tap(DR('noor', 'test run', -0.2), 0.008, px(180))
tNy = DR('noor', 'approves', 0.0)
click(tNy, 0.011, px(560)); agree(Ab2, tNy + 0.1, 0.85, px(1660))
air(G('door', 'asks', -0.2), 2.2, 0.007, px(900), 180, 900)
organ(Eb4, DR('only', 'lets in only', 0.0), DR('only', 'lets in only', 1.6), 0.5, px(1646))
knock(DR('only', "this repository's", 1.7), 0.012, px(1540), 160)
unlock(G('door', 'deploys', -0.2), 0.010, px(1646))
tMk = mark(G('door', 'deploys', 0.3), 0.85, px(1400))
paper(DR('deploys', 'production mode', -0.4), 0.010, px(1490), 0.4)
tap(DR('look', 'never change', -0.2), 0.008, px(1450))
tTw = DR('machine', 'Two people', -0.1)
chord((G3, Bb3, Eb4), tTw, tTw + 2.2, 0.5, px(1000))
organ(Bb4, DR('machine', 'a machine', 0.4), DR('machine', 'a machine', 1.9), 0.45, px(1500))

# 7. Someone else's code: one way in that's easy to miss, a line from outside the university to its machine, G minor, briefly; its
#    tag. The workflow: a page; a tap as each action is picked out; the production key's sealed card. A tag is a name: its commits,
#    and the name slid to another. Code scanning flags the one that isn't GitHub's own: a low knock. Sam pins both: the two lines
#    struck through, and the pinned lines come in exactly on their pins, two pipes; "Pinned to a commit". "A commit can't change": a
#    short chord, E-flat major. Dependabot's pull requests: a page, a tap for each; each approved by a person: Jun's yes and Sam's,
#    two fifths. The workflow's token: a page, a tap as its lines are picked out
SU = lambda lid, word, off=0: W('supply', lid, word, off)
air(SU('miss', 'nobody at the university', -0.3), 1.4, 0.008, px(170), 150, 800)
chord((G2, Bb3, D4), G('supply', 'miss', 0.3), G('supply', 'miss', 2.6), 0.5, att=0.2)
knock(SU('miss', 'nobody at the university', 0.0), 0.011, px(300), 240)
paper(G('supply', 'actions', -0.2), 0.011, px(650), 0.4)
tap(SU('actions', 'fetches', -0.2), 0.008, px(330)); tap(SU('actions', 'installs', -0.2), 0.008, px(380))
knock(SU('beside', 'production key', -0.3), 0.012, px(1550), 240)
knock(G('supply', 'tag', 0.0), 0.010, px(1550), 260)
slide(SU('tag', 'moved', 0.0), 0.008, px(1560), 1.0)
knock(SU('flags', 'flags', -0.2), 0.012, px(1150), 160)
strike(G('supply', 'pins', 0.4), 0.008, px(400))
tPn = G('supply', 'pins', 1.4)
pins((Bb3, Eb4), tPn, 0.36, 0.5, px(450), last=0.9)
knock(SU('pins', 'checked', 0.6), 0.011, px(950), 260)
chord((Eb3, Bb3, Eb4, G4), G('supply', 'commit', 0.0), G('supply', 'commit', 1.9), 0.45)
paper(G('supply', 'dependabot', 0.4), 0.010, px(650), 0.4)
tap(G('supply', 'dependabot', 0.5), 0.008, px(300)); tap(SU('dependabot', 'known flaw', -0.3), 0.008, px(300))
tRv = SU('dependabot', 'reviewed', 0.0)
agree(C3, tRv, 0.75, px(1000)); agree(Bb2, tRv + 0.4, 0.75, px(1000))
paper(G('supply', 'token', 0.3), 0.010, px(650), 0.4)
tap(SU('token', 'only read', -0.2), 0.008, px(200)); tap(SU('token', 'two deploying jobs', -0.2), 0.008, px(330))

# 8. In force at two: Wednesday 11 November, two o'clock, and the mark, the pinned tune, as the job runs the reviewed code. A week later
#    the row it can't read, a low knock; set aside, a slide; the card, every other record in by 02:15. The registrar's office: its
#    card; the row back from the tray; no power switched on (its switch, shown off, a tap). As in South Africa: someone who hadn't
#    written it checked it, one bandora note, a knock as each lesson comes, and E-flat major as it counted. In an emergency: a breath
#    along the path, faster; the amber card; its two tags. An agent's change: its tag, and a breath along the same path. The end card:
#    the home chord, the organ's low E flat, and the bandora's fifth under it, ringing out
FO = lambda lid, word, off=0: W('force', lid, word, off)
f0 = S0('force')
tap(f0 + 0.45, 0.008, px(1600))
tR = mark(FO('two', 'reviewed code', -0.2), 0.85, px(1400))
tap(G('force', 'week', 0.3), 0.008, px(1600))
knock(FO('week', 'unreadable', -0.2), 0.012, px(1646), 160)
slide(FO('rest', 'sets it aside', 0.0), 0.009, px(1500), 0.9)
knock(FO('rest', 'quarter past two', -0.3), 0.012, px(950), 240)
knock(FO('office', 'half past nine', -0.3), 0.012, px(720), 240)
slide(FO('office', 'fixes the row', 0.4), 0.008, px(1500), 0.9)
tap(FO('office', 'switched on', -0.2), 0.007, px(1300))
bandora(G2, FO('africa', 'someone', -0.2), 0.7, px(220))
for w_, x_ in (('rules came first', 390), ('someone', 960), ('counted', 1530)):
    knock(FO('africa', w_, -0.35), 0.011, px(x_), 240)
chord((Bb2, Eb3, G3, Bb3), FO('africa', 'counted', 0.0), END('force', 'africa') + 0.6, 0.5, att=0.15)
air(FO('emergency', 'faster', -0.2), 1.8, 0.007, px(1000), 180, 900)
switch(FO('emergency', 'admin account', -0.3), 0.010, px(750))
knock(FO('emergency', 'recorded', -0.2), 0.010, px(1260), 260)
tap(FO('agent', "agent's change", -0.2), 0.007, px(330))
knock(FO('agent', 'Every change', -0.2), 0.010, px(400), 260)
air(FO('agent', 'Every change', 0.6), 2.6, 0.006, px(1000), 180, 900)
tE = G('force', 'breath', 0.4)
chord((Eb2, Bb2, G3, Bb3, Eb4), tE, E('force') - 0.4, 0.75, att=0.2)
agree(Eb2, tE + 0.1, 0.7, px(500))
