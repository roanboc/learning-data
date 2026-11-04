# It feels like understanding: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, chosen on 3 November 2026 and checked against every score.py on main and on every branch, and against the series' other
# films (palettes.md): two instruments, both made here, as music.py has neither.
#  - A steel tongue drum: tongues cut into a closed steel shell, struck with soft mallets. A round, even note that blooms a moment after
#    the strike and fades, from a shell you can't see into: the agent's sound, and the sound of a fluent answer, quick, pleasing and sure.
#  - A bowed psaltery: a small triangle of strings, each bowed on its own near its pin. One slow, held note at a time, never two at once,
#    with no vibrato: the person who stops, asks and checks.
# Neither belongs to a tradition whose music the film could borrow, and nothing here imitates the music of any culture: no mode, ornament
# or rhythm of any tradition.
# The marks mean the same all through:
#  - The drum's figure, B D F# B in 1999 and D F# A D from Odyssey on: a note for each small push as the orbiter leaves Earth; a little
#    lower each time round in the nine months; whole as Odyssey goes into orbit; and under the psaltery's held D at the title and the end.
#  - The fluent sound: the drum, quick and even, a little too smooth: thirty years of routine, the answer's glow, a run of right answers.
#  - The two teams answer each other a fifth apart, the drum and the psaltery; the units' bubbles are one short figure in two keys at once.
#  - A doubt raised and never settled is one soft psaltery note, C sharp, left unanswered: the emails of 1999, and Anil's chat.
#  - The 720 students who never had their call are one low psaltery note, B, held, with no pulse.
#  - Two meanings of one word are two notes a tone apart that never meet; a question and its answer are a third apart, psaltery then drum.
#  - The three changes, Odyssey's and Jun's team's, are three rising psaltery notes, D F# A.
#  - A rating of how well we understand is its dots as notes: the scale climbing as each dot lights, and the same notes going back down.
# B minor for 1999 until "Something had to change"; D major, its relative, from Odyssey on and for today. Every chord is tuned pure from
# the key's note (just intonation, see hz()); the two keys share every note but E, which each tunes its own way.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break.
#  - Nothing trembles: every note is one string or one tongue, steady, with no vibrato, its partials harmonic once the strike has passed,
#    and every chord tuned pure. The one urgent pulse is in the opening, low and muted, from "the 23rd of September" under the engine's
#    glow, and it stops on "passed behind Mars" (film.json lists the opening in "urgent").
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. The radio line makes no sound, so its
#    ending is heard as silence.
# And everything stays low and soft, below about 2.5 kHz; the drum and the psaltery matched by loudness, the effects about 12 dB under.

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
R1 = np.random.default_rng(13)  # this film's own randomness: the mallets, the bow, the paper

# ---- tuning: just intonation from B, so a chord's notes are whole-number ratios of each other and nothing beats. B minor's chords and
# D major's (D = 6/5 of B) are all pure in this table; only E differs, 4/3 of B in B minor and 9/8 of D in D major
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
B3 = 246.94
MAJOR = [False]
def hz(m):
    o, pc = divmod(m - 59, 12)
    return B3 * 2 ** o * (27 / 20 if pc == 5 and MAJOR[0] else _JI[pc])
B2, D3, A3, Bn, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, Fs5 = 47, 50, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 78
FIG_B = (Bn, D4, Fs4, B4)      # the drum's figure in 1999
FIG_D = (D4, Fs4, A4, D5)      # and from Odyssey on
SMOOTH = (D4, Fs4, A4, D5, Fs5)  # the fluent sound: quick, even, a little too smooth
RISE = (D4, Fs4, A4)           # the three changes
DOUBT, HARM = Cs5, Bn          # a doubt left unanswered; the 720 students

# ---- the levels: the drum and the psaltery matched by loudness (a drum note's first second against a held psaltery note), about as
# far under the voice as the series' other music; the effects about 12 dB under the music (FX scales them all)
# After the author's review of the series' opening films (4 November 2026), the music is 4 dB lower and the effects 9.5 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them)
DL, SL, FX = 0.069, 0.063, 3.0

# a small room round the instruments, ringing on for about a second and a quarter
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.25)).astype(np.float32))(np.arange(int(1.25 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), because a room lifts some pitches
    and hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out

# ---- the steel tongue drum: a tongue struck with a soft mallet. Its note is the tongue's own, round, with a soft octave and a faint
# twelfth; the shell takes it up a moment after the strike (the bloom), and it fades over a few seconds. The strike itself has the
# tongue's other ways of ringing, not in tune with the note, gone within a tenth of a second, and the mallet's dull touch. A muted
# note (ring under about 1.8 s) is stopped by the player's hand, and stays under two seconds, room and all
def drum(m, s, g=1.0, pan=None, ring=None, f=None, room=0.25):
    """a tongue struck at s; ring: how long it sounds, in seconds (by default about five for a middle note, longer for a low one)"""
    f0 = f or hz(m); tau = ring / 4.6 if ring else 1.15 * (300 / f0) ** 0.4
    sec = min(7.0, tau * 4.6); x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    for r, a, k in ((1, 1.0, 1.0), (2, 0.22, 0.45), (3, 0.06, 0.22)):
        if f0 * r < 2400:
            sig += a * np.sin(2 * np.pi * f0 * r * x + 0.3 * r) * np.exp(-x / (tau * k))
    sig *= (1 - np.exp(-x / 0.007)) * (1 + 0.22 * (1 - np.exp(-x / 0.11)))
    for r, a, d in ((2.43, 0.05, 0.035), (3.71, 0.025, 0.02)):
        if f0 * r < 2400:
            sig += a * np.sin(2 * np.pi * f0 * r * x) * np.exp(-x / d)
    th = filt(noise(sec + 0.01)[:len(x)], 'low', 450) * np.exp(-x / 0.012)
    sig = sig + 0.035 * th / max(1e-9, float(np.abs(th).max()))
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    if room:
        sig = _room(sig, room) if sec >= 1.9 else _short(sig, room)
    put(sig.astype(np.float32), s, g * DL, max(-0.35, min(0.35, (m - 66) * 0.025)) if pan is None else pan)
def _short(sig, room):
    """a muted note's room, cut so the whole stays under two seconds"""
    tail = int(min(len(_IR), 1.95 * SR - len(sig)))
    if tail <= 0:
        return sig
    wet = fftconvolve(sig, _IR[:tail]).astype(np.float32); out = np.pad(sig, (0, tail)); out[:len(wet)] += room * wet
    j = min(len(sig), int(0.6 * SR)); r0, r1 = np.sqrt((sig[:j] ** 2).mean()), np.sqrt((out[:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out

# ---- the bowed psaltery: one thin steel string bowed near its pin. A bowed string's partials, all harmonic, with the glassy lift a
# steel string has near 1.4 kHz; they speak a moment apart as the bow catches, the higher ones last, and once the bow leaves the string
# rings on, the higher partials fading first. A faint hush of rosin while it bows. Held steady, with no vibrato
def psal(m, a, b, g=1.0, att=0.45, rel=1.4, pan=None, f=None, room=0.3):
    """a string bowed from a to b; it speaks over att, and rings on over rel once the bow leaves it"""
    f0 = f or hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, int(2400 // f0) + 1):
        fk = f0 * k
        ak = (1 / k ** 0.85) * (1 + 0.6 * np.exp(-((fk - 1400) / 600) ** 2)) * np.exp(-fk / 2600)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.12 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * 2.6 * (1 + 0.35 * (k - 1)) / rel), 1.0)
        sig += ak * on * off * np.sin(2 * np.pi * fk * x + 0.9 * k)
    if sec >= 1.2:
        sig *= 0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1))
    sig /= max(1e-9, float(np.abs(sig).max()))
    hush = filt(noise(n / SR + 0.01)[:n], 'band', (700, 2200)) * 0.006 * np.where(x < sec, np.minimum(1, x / att), 0)
    sig = _room(filt((sig + hush).astype(np.float32), 'low', 2400), room, min(att * 1.5, sec * 0.5), sec)
    put(sig, a, g * SL, max(-0.3, min(0.3, (m - 66) * 0.02)) if pan is None else pan)

# ---- what they play
def figure(s, notes, step=0.5, g=1.0, ring=None, pan=None, f=1.0):
    """the drum, a note after another; f moves the whole figure (16/15 a semitone up, to another key)"""
    for i, m in enumerate(notes):
        drum(m, s + step * i, g, pan, ring, hz(m) * f)
def mark(s, hold, g=1.0, at=0.5):
    """the film's mark: the drum's figure (from at seconds in) under the psaltery, which holds the home note"""
    psal(D5, s, s + hold, 0.8 * g, att=0.8, rel=1.8)
    figure(s + at, FIG_D, 0.55, 0.75 * g)

# ---- soft sounds, all low-passed, on the effects bus
def puff(s, g=0.014, pan=0.0):
    """a small thruster's soft puff"""
    x = tt(0.5); X(filt(noise(0.5), 'band', (180, 1100))[:len(x)] * (1 - np.exp(-x / 0.015)) * np.exp(-x / 0.11), s, g * FX, pan)
def rumble(s, sec, g=0.012, pan=0.0):
    """an engine, far off and low: a soft swell of low noise"""
    x = tt(sec); X(filt(noise(sec), 'band', (55, 320))[:len(x)] * np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 0.7, s, g * FX, pan)
def slide(s, sec=1.4, g=0.011, pan=0.0):
    """a card slid along a desk: a dry, even rub"""
    x = tt(sec); gr = filt(noise(sec), 'low', 25)[:len(x)]; gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    X(filt(noise(sec), 'band', (220, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4 * gr, s, g * FX, pan)
def whoosh(s, sec=0.8, g=0.010, pan=0.0):
    """something light through the air: an envelope, a message"""
    s_air(s, sec, g * FX, pan, 140, 900)
def pencil(s, sec=1.0, g=0.009, pan=0.0):
    """graphite on the wall or on paper: a soft, grainy scratch"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 70)[:len(x)]); gr = gr / max(1e-9, float(gr.max()))
    X(filt(noise(sec), 'band', (600, 2200))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5 * (0.3 + 0.7 * gr), s, g * FX, pan)
def tick(s, g=0.011, pan=0.0):
    """a tick drawn: its two strokes, short and soft"""
    s_tap(s, g * FX, pan); s_tap(s + 0.08, 0.7 * g * FX, pan)
def page(s, g=0.009, pan=0.0, sec=0.24):
    """a page turned, or a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 2200))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * np.exp(-x / (0.5 * sec)), s, g * FX, pan)
def zip_(s, sec=1.4, n=12, g=0.010, pan=0.0):
    """a zip drawn: some of its teeth, one after another, faster in the middle, under a soft rub (a click for each of its thirty teeth
    came 21 to a second, a rattle: 4 November 2026)"""
    u = np.linspace(0, 1, n); at = s + sec * (u - 0.12 * np.sin(2 * np.pi * u) / (2 * np.pi) * 2)
    for i, t in enumerate(at):
        x = tt(0.012); X(filt(noise(0.012), 'band', (700, 2200))[:len(x)] * np.exp(-x / 0.003), t, g * FX * (0.6 + 0.4 * R1.uniform()), pan)
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, 0.35 * g * FX, pan)
def creak(s, g=0.009, pan=0.0, sec=0.55):
    """a chair leaned back: a low, slow wooden give"""
    x = tt(sec).astype(np.float64); f = 150 - 40 * x / sec; ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(k * ph) / k for k in range(1, 9)); env = np.sin(np.pi * x / sec) ** 1.5
    X(filt((tone * env).astype(np.float32), 'band', (220, 1100)) / 3, s, g * FX, pan)
def folder(s, g=0.012, pan=0.0):
    """a card folder opened: its cover's soft thud, and the paper inside"""
    s_knock(s, g * 0.8 * FX, pan, 170); page(s + 0.05, g * 0.9, pan, 0.35)
def pen(s, g=0.009, pan=0.0):
    """initials written: three quick strokes"""
    for d, sec in ((0, 0.24), (0.3, 0.28), (0.62, 0.22)):
        pencil(s + d, sec, g, pan)
def keys(s, n, g=0.010, pan=0.0, step=0.14):
    """keys typed softly"""
    for i in range(n):
        s_tap(s + i * step + 0.03 * R1.uniform(), (g if i < 2 else g * 0.7) * FX, pan)
def tap(s, g=0.010, pan=0.0):
    """a tool touched: one soft tap"""
    s_tap(s, g * FX, pan)

# =============================================================================================================================
# 1. Two teams, one number: the opening, B minor until "Something had to change". Earth and Mars drawn in pencil; the drum's figure, a
#    note for each small push as the orbiter leaves Earth; the builders' drum and the navigators' psaltery answering a fifth apart; the
#    units' bubbles, the figure in two keys at once; the pushes counted small, muted; each team sure, the fifth together; nine months,
#    the figure a little lower each time round; the emails, a psaltery C sharp each, unanswered; thirty years, the fluent sound in B
#    minor. The burn: the one urgent pulse, low and muted, to "passed behind Mars", and the drum's last note left to fade; silence.
#    Odyssey, D major: three rising psaltery notes for its three changes, the figure whole as it goes into orbit. Today: the two bubbles
#    in two keys again, then one; the faculty's list, a tick; and the title on the film's mark
ow = lambda lid, word, off=0: W('orbiter', lid, word, off)
oc = lambda lid, off=0: G('orbiter', lid, off)
pencil(ow('launch', 'December', -0.6), 1.3, 0.008, px(400)); pencil(ow('launch', 'December', -0.2), 1.3, 0.008, px(1500))
launched = ow('launch', 'launched')
drum(Bn, launched, 0.9)
drum(D4, ow('thrusters', 'small thrusters'), 0.8)
drum(Fs4, ow('thrusters', 'each firing'), 0.8); puff(ow('thrusters', 'each firing'), 0.014, px(1100))
drum(B4, ow('thrusters', 'pushed'), 0.8); puff(ow('thrusters', 'pushed'), 0.012, px(1100))
# the builders, and the navigators: the drum, and the psaltery a fifth above
drum(Bn, ow('builders', 'Colorado', -0.2), 0.75, px(300))
psal(Fs4, ow('file', 'California', -0.2), ow('file', 'California', 1.4), 0.75, pan=px(1620))
slide(ow('file', 'sent'), 1.6, 0.011, px(830))
# the units' bubbles: the same short figure in two keys at once, softly, for a moment only
figure(ow('gave', 'pound-seconds', -0.3), (Bn, D4, Fs4), 0.12, 0.45, 1.2, px(300))
figure(ow('gave', 'pound-seconds', -0.3), (Bn, D4, Fs4), 0.12, 0.45, 1.2, px(1620), 16 / 15)
# the navigators' monitor: each push counted at less than a quarter of its size, muted
for k in range(3):
    drum(Bn, ow('quarter', 'counted', 0.4 * k), 0.45, px(1426), 1.0)
# each team sure: the fifth, together
drum(Bn, ow('sure', 'the same', -0.1), 0.6, px(300)); psal(Fs4, ow('sure', 'the same', -0.1), ow('sure', 'the same', 1.2), 0.6, pan=px(1620))
# nine months: a push at each of seven moments, the figure a little lower each time it comes round, as the small errors add up
for k in range(7):
    drum(FIG_B[k % 4], oc('months', 0.2 + 0.7 * k), 0.6 - 0.03 * k, px(1100), 1.7, hz(FIG_B[k % 4]) * (1 - 0.0045 * k))
pencil(ow('months', 'nine months'), 2.6, 0.006, px(1200))
# from April: an email a month, each a soft psaltery note, none answered; the four settle in a pile
for i in range(4):
    t0 = ow('april', 'April', 1.25 * i)
    psal(DOUBT, t0 + 0.15, t0 + 0.85, 0.5, att=0.35, rel=1.1, pan=px(1300))
    whoosh(t0, 1.0, 0.008, px(1300 - 60 * i))
    page(ow('april', 'never settled', 0.3 + 0.12 * i), 0.005, px(1380))
# thirty years of success: thirty small ticks along the skirting, and the fluent sound, in B minor
figure(ow('routine', 'thirty years', -0.2), (Bn, D4, Fs4, B4, D5), 0.16, 0.55)
# the 23rd of September 1999: the one urgent pulse, low and muted, under the engine's glow, until it passes behind Mars; then the drum's
# last note, left to fade, and silence until "Something had to change"
pulse(ow('burn', 'twenty-third'), ow('behind', 'passed behind'), 76, [(0, lambda t, g, p: drum(B2, t, 0.55 * g, p, 0.9), 1.0, 0.0)], 1.0, 1.4)
rumble(ow('burn', 'fired'), ow('behind', 'passed behind', 0.6) - ow('burn', 'fired'), 0.010)
pencil(ow('behind', 'a hundred and seventy', -0.2), 0.6, 0.006, px(1400))
drum(Bn, ow('behind', 'passed behind'), 0.55, 0.0, 6.0)
# Odyssey: D major. The craft on its way, the chord; its team's three changes, three rising psaltery notes; a second person's tick;
# and as it goes into orbit, the drum's figure, whole
MAJOR[0] = True
figure(ow('odyssey', 'Mars Odyssey', -0.3), (D3, A3), 0.3, 0.5)
for m, (lid, word) in zip(RISE, (('odyssey', 'both units'), ('independent', 'critical'), ('second', 'second way'))):
    psal(m, ow(lid, word, -0.2), ow(lid, word, 1.5), 0.7, att=0.5, rel=1.4)
tick(ow('independent', 'independently', -0.2), 0.009, px(1150)); tick(ow('independent', 'independently', 0.1), 0.008, px(1192))
figure(ow('orbit', 'went into orbit'), FIG_D, 0.5, 0.8)
# today: a person and an agent, each sure: the two bubbles, one figure in two keys again; said, both turn to "people", and the figure is
# one; the faculty's list slides in beside the number, and a tick. The title, on the film's mark
figure(ow('risk', 'each sure', -0.6), RISE, 0.12, 0.4, 1.2, px(330))
figure(ow('risk', 'each sure', -0.6), RISE, 0.12, 0.4, 1.2, px(1440), 16 / 15)
figure(ow('rely', 'Say what', 0.3), RISE, 0.14, 0.5)
slide(ow('rely', 'check it'), 1.0, 0.010, px(1100)); tick(ow('rely', 'check it', 1.1), 0.010, px(1206))
mark(oc('breath', 0.2), 4.4)

# 2. A fluent answer: the drum at the turn; Anil's question carried to Jun, and into the agent; its hands at the catalog and the query;
#    the check's tick; the answer, the fluent sound; the number carried back, typed; the answer's glow, the fluent sound again, a little
#    too smooth, and Jun leaning back
fw = lambda lid, word, off=0: W('fluent', lid, word, off)
fc = lambda lid, off=0: G('fluent', lid, off)
figure(S0('fluent') + 0.3, (D4, A4), 0.4, 0.5)
whoosh(fw('asks', 'data team', -0.25), 1.3, 0.008, px(900)); whoosh(fw('agent', 'the agent', -0.1), 0.9, 0.007, px(1100))
tap(fw('hands', 'read the catalog', 0.4), 0.009, px(1530)); tap(fw('hands', 'run a query', 0.5), 0.009, px(1530))
tick(fw('hands', 'the source'), 0.010, px(1150))
figure(fw('answer', 'two thousand', -0.1), (Fs4, A4, D5), 0.13, 0.6)
whoosh(fw('answer', 'evidence attached', -0.1), 1.2, 0.007, px(1300)); keys(fw('answer', 'evidence attached', 1.4), 5, 0.008, px(1300))
figure(fw('feels', 'feels', -0.4), SMOOTH, 0.15, 0.6)
creak(fw('feels', 'feels', 0.3), 0.008, px(300))

# 3. Explain it: the zip, its teeth; the viewer's rating, the dots as notes climbing to five, and after trying, the same notes going back
#    down to three; the pencil over the blank lines makes no sound. Jun's six, climbing quickly; the questions, in silence; the frosted
#    glass slides in, and the six falls to two, the same notes going down
ew = lambda lid, word, off=0: W('explain', lid, word, off)
SCALE = (D4, E4, Fs4, G4, A4, B4, Cs5)
zip_(ew('now', 'closes and opens', -0.3), 1.4, 12, 0.016, px(960))
for k in range(5):
    drum(SCALE[k], ew('try', 'from one to seven', 0.32 * k), 0.5, px(820 + 60 * k))
drum(G4, ew('lower', 'rated themselves lower', 0.6), 0.4, px(980), 1.5); drum(Fs4, ew('lower', 'rated themselves lower', 1.2), 0.4, px(920), 1.5)
for k in range(6):
    drum(SCALE[k], ew('six', 'a six', -0.2 + 0.15 * k), 0.45, px(660 + 30 * k))
slide(ew('cant', "He can't"), 1.3, 0.008, px(1300))
for k in range(4):
    drum(SCALE[4 - k], ew('cant', 'not even roughly', 0.4 * (k + 1)), 0.4, px(800 - 30 * k), 1.5)

# 4. Right every time: the calendar's pages, and a tick on every month, the fluent sound; Anil's doubt in the chat, a psaltery C sharp,
#    unanswered, and the two messages let go; the review's busy hands; thirty ticks again, the fluent sound; nine advisers planned, twelve
#    needed, and the 720 students, one low psaltery note, held
rw = lambda lid, word, off=0: W('right', lid, word, off)
rc = lambda lid, off=0: G('right', lid, off)
for k in range(5):
    page(S0('right') + 0.4 + 0.7 * k, 0.006, px(730))
figure(rw('months', 'been right', -0.2), SMOOTH, 0.5, 0.45)
psal(DOUBT, rw('chat', 'wrote in a chat'), rw('chat', 'wrote in a chat', 1.3), 0.5, att=0.35, rel=1.2, pan=px(720))
whoosh(rw('replied', 'let it go'), 1.4, 0.007, px(950))
slide(rw('busy', 'above all'), 0.9, 0.007, px(300)); slide(rw('experts', 'experts too', 0.2), 0.9, 0.007, px(1650))
figure(rw('routine', 'orbiting Mars', -0.2), SMOOTH, 0.16, 0.5)
psal(HARM, rw('needed', 'seven hundred and twenty', -0.2), rw('needed', 'seven hundred and twenty', 2.6), 0.75, att=0.7, rel=1.6, pan=px(736))

# 5. One word, two meanings: Anil counts the lists, page by page; the gap between 2,880 and 2,160, the low B again; the table laid down.
#    Jun means people, the psaltery's A; the agent took the table's meaning, the drum's B, a tone above: the two never meet. "You
#    mean...?", the psaltery, and "Yes.", the drum, a third below, and a tick. The agent goes straight to its answer, sure; its check
#    closes its own circle, a tick and the fluent sound; the folder opened at last, the evidence fanned out, and the low B as
#    "full-time equivalents" turns amber
mw = lambda lid, word, off=0: W('meanings', lid, word, off)
mc = lambda lid, off=0: G('meanings', lid, off)
for i in range(9):
    page(mw('counted', "the advisers' lists", 0.18 * i), 0.005, px(120 + 112 * i))
psal(HARM, mw('counted', 'two thousand', 1.9), mw('counted', 'two thousand', 3.8), 0.6, att=0.6, rel=1.4, pan=px(700))
page(mc('load', -0.2), 0.008, px(960), 0.4)
psal(A4, mw('meant', 'Jun meant'), mw('meant', 'the agent took', 1.2), 0.6, att=0.5, rel=1.3, pan=px(340))
drum(B4, mw('meant', 'the agent took'), 0.5, px(1150))
psal(Fs4, mw('people', 'say it back', -0.3), mw('people', 'say it back', 0.9), 0.6, att=0.35, rel=1.1, pan=px(690))
drum(D4, mw('people', 'or ask', -0.1), 0.6, px(1010)); tick(mw('people', 'or ask', 0.5), 0.010, px(960))
whoosh(mw('study', 'do this less'), 1.6, 0.007, px(860)); drum(D5, mw('study', 'do this less', 1.4), 0.5, px(740))
pencil(mw('same', 'compared its total'), 1.8, 0.006, px(950))
tick(mw('same', 'so it passed', -0.2), 0.010, px(950)); figure(mw('same', 'so it passed', -0.2), (A4, D5), 0.13, 0.45)
folder(mw('record', 'And the record', -0.1), 0.012, px(780))
for k in range(3):
    page(mw('record', 'what its hands did', 0.6 + 0.45 * k), 0.006, px(1100 + 120 * k))
psal(HARM, mw('record', 'full-time equivalents', -0.2), mw('record', 'full-time equivalents', 1.8), 0.6, att=0.6, rel=1.5, pan=px(1100))

# 6. Knowing, not feeling: NASA's review board, one held D; Jun's team's three changes, the opening's three rising notes, each as its card
#    appears; the 720, low and short; the doubts gathered into one page, written with an owner, answered; a person's initials; and the
#    board complete, the drum taking up the three notes
kw = lambda lid, word, off=0: W('knowing', lid, word, off)
kc = lambda lid, off=0: G('knowing', lid, off)
psal(D4, kw('board', 'plainly', 0.2), kw('board', 'catch them', 0.8), 0.6, att=0.8, rel=1.6)
for m, lid in zip(RISE, ('say', 'check', 'log')):
    psal(m, kc(lid, -0.1), kc(lid, 2.0), 0.65, att=0.5, rel=1.4)
psal(HARM, kw('check', 'own list', 0.9), kw('check', 'own list', 2.0), 0.4, att=0.4, rel=1.0, pan=px(911))
whoosh(kw('log', 'Write every doubt'), 1.2, 0.007, px(1580)); page(kw('log', 'Write every doubt', 1.0), 0.006, px(1580))
pencil(kw('log', 'with an owner', -0.5), 0.6, 0.006, px(1500)); tick(kw('log', 'answered'), 0.009, px(1720))
pen(kw('decides', 'a person decides'), 0.008, px(1640))
figure(kw('decides', 'only for reference', 0.6), RISE, 0.22, 0.45)

# 7. Feeling sure is not knowing: this term the agent reads the question back, the psaltery, and Jun's "Yes", the drum; its hands; the
#    faculty's list slides in and agrees, drum and psaltery on one note, a tick and Jun's initials; twelve lists ticked; a fluent answer,
#    a green tick and a long run of success, the drum, sweet; Odyssey still at work, in silence; and the film's mark to the end
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
psal(Fs4, cw('again', 'reads it back'), cw('again', 'reads it back', 1.6), 0.55, att=0.4, rel=1.2, pan=px(1000))
drum(D4, cc('yes'), 0.55, px(330))
tap(cc('yes', 0.9), 0.009, px(1530)); tap(cc('yes', 1.8), 0.009, px(1530))
slide(cw('counts', 'own list agrees', -0.5), 0.9, 0.008, px(1100))
drum(D4, cw('counts', 'own list agrees', 0.1), 0.6); psal(D4, cw('counts', 'own list agrees', 0.1), cw('counts', 'own list agrees', 1.4), 0.55, att=0.4, rel=1.2)
tick(cw('counts', 'own list agrees', 0.4), 0.010, px(1732)); pen(cw('counts', 'own list agrees', 1.0), 0.008, px(890))
for i in range(12):  # one soft stroke for each tick drawn (two each came nineteen to a second)
    tap(cw('twelve', 'every student', 0.11 * i + 0.3), 0.004 * (1.0 if i < 6 else 0.7), px(120 + 112 * i))
for m, word in ((D4, 'A fluent answer'), (Fs4, 'a green tick'), (A4, 'a long run')):
    drum(m, cw('fluent', word, -0.2), 0.5)
mark(cw('plan', 'plan on'), cc('breath', 3.2) - cw('plan', 'plan on'), 0.9, cc('breath', 0.1) - cw('plan', 'plan on'))
