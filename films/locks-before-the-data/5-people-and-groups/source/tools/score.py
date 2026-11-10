# People and groups: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, taken in the module's palettes list (/mnt/project-files/data-protection/palettes.md, 5 November 2026, 13:08 UTC) after
# checking every score.py on main and on every branch: an EMS VCS3 and a square bass recorder, both made here (music.py has neither).
#  - The VCS3, the small British synthesizer of 1969 (Electronic Music Studios, London: Peter Zinovieff, Tristram Cary and David
#    Cockerell; sold from 1970). Its sounds are joined on a pin board, sixteen holes by sixteen: a pin pushed into a hole connects one
#    row to one column, and pulling it out ends the connection. Played softly, one or two notes at a time: a round tone of sine and
#    triangle through its low-pass filter, opened gently as each note starts and settling, no vibrato, nothing sweeping, nothing above
#    2.4 kHz. The film's grid of groups and doors: a right only where a pin is in, and admin power a pin pushed in for a task and
#    pulled when it's done.
#  - The mark, the film's: a chord built pin by pin, one note joining at a time (pins()). At a switch-on, one note joins for the task
#    and leaves cleanly when it ends, and the chord goes on without it (task()).
#  - A square bass recorder of plywood, as Herbert Paetzold began making them about 1975 from his uncle Joachim's design: low (F2 to
#    F3, under the voice), breathy and wooden, one voice, no vibrato: the people, each joining as themselves. Held only under the
#    opening, at a chapter's turn and at the end.
#  - D-flat major; B-flat minor for the problem: keys and tokens that outlive their stay. No E-flat minor chord, and no E flat held
#    with B flat or G flat: their fifths aren't pure in this tuning (see hz()).
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles or beats: no vibrato, no tremolo; every interval tuned pure (just intonation from D flat). No pulse: the film has
#    no urgent chapter (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (eleven admins, six
#    slots, a list's dates) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1975)  # this film's own randomness: the room, the breath

# ---- tuning: just intonation from D flat, so a chord's notes are whole-number ratios of each other and nothing beats. D-flat, G-flat
# and A-flat major, B-flat minor and F minor are all pure in this table; E flat with B flat, and E flat with G flat, are not (40/27,
# 27/16), so neither is held together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (49, 138.591)  # D flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the VCS3's notes, A flat 3 to E flat 5, and the recorder's, F2 to F3
Ab3, Bb3, C4, Db4, Eb4, F4, Gb4, Ab4, Bb4, C5, Db5, Eb5 = 56, 58, 60, 61, 63, 65, 66, 68, 70, 72, 73, 75
F2, Gb2, Ab2, Bb2, C3, Db3, Eb3, F3 = 41, 42, 44, 46, 48, 49, 51, 53

# ---- the levels, set so the music's loud moments sit near -28 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the recorder under the VCS3; the effects about 16 dB under the music
# (FX scales them all)
VL, RL, FX = 0.036, 0.046, 1.4

# a room round the players: a small studio with soft walls, ringing on for about a second, nothing much above 2 kHz. Its level is set
# by what it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level in it (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 2000); _IR[:int(0.018 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the VCS3: a sine with a little of a triangle (odd harmonics falling as 1/k squared) and a trace of the second harmonic, through
# its low-pass filter (18 dB an octave, as the VCS3's own, with no resonance). The filter opens gently as the note starts, from 1.4 to
# 3.6 times the note's pitch over a quarter of a second, and settles near 2.6 over the next second, so the note's first moment is a
# little brighter and nothing sweeps after it. Held steady, with no vibrato; nothing above 2.4 kHz
_VW = {1: 1.0, 2: 0.06, 3: 0.13, 5: 0.05, 7: 0.025, 9: 0.015, 11: 0.01}
def vcs(m, a, b, g=1.0, att=0.06, rel=0.4, pan=0.0, room=0.32):
    f = hz(m); sec = max(0.2, b - a); n = int((sec + 1.6 * rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    fc = f * (1.4 + 2.2 * np.sin(0.5 * np.pi * np.minimum(x / 0.25, 1)) ** 2 - 1.0 * (1 - np.exp(-np.maximum(0.0, x - 0.25) / 0.9)))
    for k, w in _VW.items():
        fk = f * k
        if fk > 2400:
            continue
        s = s + w / np.sqrt(1 + (fk / fc) ** 6) * np.sin(2 * np.pi * fk * x + 0.3 * k)
    s = s * np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2 * np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    s = s / max(1e-9, float(np.abs(s).max()))
    put(_held(filt(s.astype(np.float32), 'low', 2400), room), a, g * VL, pan)
def pins(notes, end, g=1.0, pan=0.0, rel=0.5):
    """the film's mark: a chord built pin by pin. notes is [(note, when it joins)]; each is held from then until end"""
    for i, (m, t0) in enumerate(notes):
        vcs(m, t0, end, g * (0.9 + 0.05 * min(i, 2)), rel=rel, pan=pan)
def task(m, a, b, g=1.0, pan=0.0):
    """at a switch-on: one note joins for the task, and leaves cleanly when the task ends"""
    vcs(m, a, b, g, att=0.08, rel=0.25, pan=pan)
def line(notes, s, g=1.0, pan=0.0):
    """the VCS3, one note after another: notes is [(note, length)], each joined to the next; returns when the last one ends"""
    t = s
    for m, d in notes:
        vcs(m, t, t + d, g * (0.9 if d < 0.5 else 1.0), rel=0.3 if d < 0.5 else 0.45, pan=pan)
        t += d
    return t

# ---- the square bass recorder: a wooden tube of square section, blown softly. Its first harmonic strong, the second and third
# clear (the square bore's woodiness), the rest faint and soft above 700 Hz; the higher harmonics speak a moment after the first; a
# little breath through the windway all through the note, and its chiff as the note speaks. One voice: each note ends before the next
# begins. A note of 1.5 s or more swells a little and eases, once, as a player's breath does
_RW = {1: 1.0, 2: 0.40, 3: 0.22, 4: 0.09, 5: 0.06, 6: 0.03, 7: 0.015}
def rec(m, a, b, g=1.0, att=0.09, rel=0.2, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + 1.6 * rel + 0.15) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k, w in _RW.items():
        fk = f * k
        if fk > 1800:
            continue
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2
        s = s + w * np.exp(-max(0.0, fk - 700) / 500) * on * np.sin(2 * np.pi * fk * x + 0.7 * k)
    s = s * np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    if sec >= 1.5:
        s = s * (0.94 + 0.06 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (220, 1500)) * (0.018 * np.where(x < sec, 1.0, np.exp(-(x - sec) * 18)) + 0.09 * np.exp(-x / 0.035))
    put(_held(filt((s + br).astype(np.float32), 'low', 1900), room), a, g * RL, pan)
def rline(notes, s, g=1.0, pan=0.0):
    """the recorder, one note after another: notes is [(note, length)]; returns when the last one ends"""
    t = s
    for m, d in notes:
        rec(m, t, t + d - 0.04, g, pan=pan)
        t += d
    return t

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft wooden knock: a card, a pill or a tag set down"""
    s_knock(s, g * FX, pan, f)
def dull(s, g=0.012, pan=0.0):
    """a low, dull knock: a card that opens nothing, a door that stays shut"""
    s_knock(s, g * FX, pan, 160)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a light, a tick, a touch"""
    s_tap(s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: the fjord's wind, something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def paper(s, g=0.009, pan=0.0, sec=0.4):
    """a page laid down"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (250, 1900)), 'low', 2200)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def click(s, g=0.010, pan=0.0):
    """a switch: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def lock(s, g=0.010, pan=0.0):
    """a lock closing, or opening"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def keyin(s, g=0.009, pan=0.0):
    """a key slid into a lock and turned: a short scrape, and its click"""
    x = tt(0.3); X(filt(filt(noise(0.3), 'band', (500, 1800)), 'low', 2200)[:len(x)] * np.sin(np.pi * x / 0.3) ** 2, s, g * 0.6 * FX, pan)
    s_knock(s + 0.34, g * FX, pan, 440); s_tap(s + 0.35, g * 0.6 * FX, pan)
def slide(s, g=0.008, pan=0.0, sec=0.45):
    """a plastic card slid into its slot, or out: a soft brush, and its small stop"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (350, 1600)), 'low', 2200)[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
    s_knock(s + sec * 0.85, g * 0.45 * FX, pan, 360)
def stamp(s, g=0.014, pan=0.0):
    """a rubber stamp pressed down: a low knock and its soft slap"""
    s_knock(s, g * FX, pan, 150); x = tt(0.08); X(filt(filt(noise(0.08), 'band', (200, 1100)), 'low', 2200)[:len(x)] * np.exp(-x / 0.014), s + 0.005, g * 0.5 * FX, pan)
def typing(s, sec, g=0.005, pan=0.0, step=0.21):
    """keys typed softly: a muffled tap every step, never a burst"""
    for k in range(int(sec / step)):
        s_tap(s + k * step + 0.03 * (k % 2), g * (0.8 + 0.2 * (k % 3 == 0)) * FX, pan)

# =============================================================================================================================
# 1. Keys that outlive the stay: Moss, 1970s, with music all through it. The fjord's wind, the town on the recorder, low; Moss at dusk,
#    the chord built pin by pin: D flat, F, A flat. Tor Sørnes joins on the recorder, D flat. The hotels' problem: B-flat minor. A key
#    not handed in: its pill. Still opens Room 312: a line falling to D flat, the recorder's F under it. The key turned in the lock;
#    the light under the door dims, and the guest sleeps: B flat and D flat held, the recorder low. Something has to change: the line
#    rises to A flat, open
K = lambda lid, word, off=0: W('keys', lid, word, off)
k0 = S0('keys')
air(k0 + 0.3, 3.2, 0.008, px(1500), 140, 700)
rec(Ab2, k0 + 0.5, k0 + 5.6, 0.75, pan=-0.05)
pins([(Db4, k0 + 1.1), (F4, k0 + 2.2), (Ab4, k0 + 3.3)], k0 + 6.4, 0.8, px(1000))
tSo = G('keys', 'sornes')
knock(tSo - 0.1, 0.011, px(720), 240)
rec(Db3, tSo + 0.1, tSo + 2.9, 0.7, pan=px(470))
vcs(F4, tSo + 0.3, tSo + 2.9, 0.6, pan=px(800)); vcs(Ab4, tSo + 1.2, tSo + 2.9, 0.55, pan=px(800))
tHo = G('keys', 'hotels')
pins([(Bb3, tHo + 0.2), (Db4, tHo + 1.1)], K('forget', 'forget to hand', 0.6), 0.75, px(700))
rec(Bb2, tHo + 0.3, K('forget', 'forget to hand', 0.4), 0.6, pan=px(600))
tFo = K('forget', 'forget to hand')
tap(tFo - 0.1, 0.007, px(480)); knock(tFo, 0.011, px(700), 240)
air(K('forget', 'or lose', 0.1), 1.6, 0.006, px(1200), 130, 600)
tSt = K('opens', 'still opens')
knock(tSt + 0.1, 0.011, px(1150), 240)
line(((F4, 0.5), (Eb4, 0.5), (Db4, 2.2)), tSt + 0.15, 0.7, px(1300))
rec(F2, tSt + 0.2, K('opens', 'long after', 1.6), 0.6, pan=px(1280))
tLt = K('anyone', 'let themselves')
keyin(tLt - 0.2, 0.009, px(990))
tSl = K('anyone', 'while that guest slept')
pins([(Bb3, tSl - 0.1), (Db4, tSl + 0.8)], tSl + 3.0, 0.7, px(990))
rec(F2, tSl + 0.2, tSl + 3.2, 0.6, pan=px(990))
tCh = G('keys', 'change')
line(((Db4, 0.45), (Eb4, 0.45), (F4, 0.5), (Ab4, 2.4)), tCh, 0.8, 0.0)
rec(Ab2, tCh + 1.0, tCh + 4.0, 0.65, pan=0.0)

# 2. A card for each stay: the workshop, a punched card: D flat and F. The pattern card goes in from inside the room: the mark, D flat,
#    F, A flat and D flat, a pin for each line of holes. At the desk the old pattern slides out and the new one in: A flat, D flat, F;
#    the guest's card in, and green: the guest joins on the recorder. The last guest's card: in, and a dull knock; no chord. Atlanta,
#    1978: its floors light, A-flat major rising pin by pin; burglaries, its slip. A lost card opens nothing: a dull knock; a new
#    pattern: G-flat major. By 2011: the corridor's doors light one after another, a pin for each; its card; the card lock green; a
#    key that ends with the stay: the recorder's D flat under A flat and D flat. At the university, what outlived the stay: B-flat
#    minor, a pin for each coral tag, the recorder low. Three earlier films, and the two tools: D-flat major again. The title: the
#    mark, D flat, F, A flat, over the recorder
C2 = lambda lid, word, off=0: W('card', lid, word, off)
c0 = S0('card')
vcs(Db4, c0 + 0.5, c0 + 2.4, 0.55, pan=px(520)); vcs(F4, C2('lock', 'punched plastic', 0.0), c0 + 3.2, 0.5, pan=px(520))
air(C2('inside', 'Inside each lock', -0.3), 0.8, 0.006, px(1340), 200, 1000)
tPu = C2('inside', 'put in from inside')
slide(tPu - 0.4, 0.008, px(1340), 0.4)
pins([(Db4, tPu - 0.2), (F4, tPu + 0.2), (Ab4, tPu + 0.6), (Db5, tPu + 1.0)], tPu + 2.8, 0.7, px(1340))
tNp = C2('guest', 'puts in a new pattern')
slide(tNp - 0.3, 0.007, px(1340), 0.5)
slide(tNp + 0.6, 0.008, px(1340), 0.5)
pins([(Ab3, tNp + 0.6), (Db4, tNp + 1.1), (F4, tNp + 1.55)], C2('guest', 'gives the guest', 3.8), 0.65, px(1340))
tGv = C2('guest', 'gives the guest')
slide(tGv + 0.05, 0.008, px(1100), 0.6)
tap(tGv + 1.2, 0.007, px(1340))
rec(Db3, tGv + 1.7, tGv + 4.2, 0.65, pan=px(1100))
tLs = G('card', 'last')
slide(tLs - 0.45, 0.007, px(1100), 0.45)
slide(tLs + 0.25, 0.008, px(1100), 0.6)
dull(C2('last', 'opens nothing', 0.1), 0.012, px(1340))
tFi = C2('atlanta', 'the first go')
knock(G('card', 'atlanta', -0.2), 0.010, px(300), 240)
vcs(Ab3, tFi, tFi + 2.4, 0.6, pan=px(900)); vcs(Eb4, tFi + 1.1, tFi + 3.4, 0.55, pan=px(960))
vcs(Ab4, tFi + 2.2, tFi + 4.6, 0.55, pan=px(1020)); vcs(C5, tFi + 3.3, tFi + 5.4, 0.5, pan=px(1080))
knock(C2('atlanta', 'troubled by burglaries', -0.2), 0.011, px(1240), 220)
dull(C2('lost', 'opens nothing', -0.1), 0.012, px(1330))
tNw = C2('lost', 'only a new card')
slide(tNw - 0.3, 0.007, px(1250), 0.4)
pins([(Db4, tNw + 0.1), (Gb4, tNw + 0.55), (Bb4, tNw + 1.0)], tNw + 2.8, 0.6, px(1250))
tSp = G('card', 'spread')
knock(tSp + 0.1, 0.011, px(400), 240)
tRm = C2('spread', 'six and a half million')
for i, (m, x_) in enumerate(((Db4, 760), (F4, 1220), (Ab4, 700), (Db5, 1280))):
    vcs(m, tRm - 0.2 + 0.85 * i, tRm + 3.6, 0.5, rel=0.5, pan=px(x_))
    tap(tRm - 0.2 + 0.85 * i, 0.006, px(x_))
tap(tRm + 2.8, 0.008, px(990))
tEn = G('card', 'ends')
knock(tEn - 0.1, 0.011, px(990), 240)
pins([(Ab3, tEn - 0.1), (Db4, tEn + 0.8)], tEn + 3.0, 0.6, px(990))
rec(Db3, tEn, tEn + 3.0, 0.65, pan=0.0)
tJb, tTk, tTo = C2('uni', "outlive a person's job"), C2('uni', 'outlived the task'), G('card', 'token')
for t_, y_ in ((tJb - 0.1, 300), (tTk - 0.1, 420), (tTo + 0.1, 540)):
    knock(t_, 0.011, px(560), 230)
vcs(Bb3, tJb, tTk + 1.0, 0.6, pan=px(900)); vcs(Db4, tTk, tTo + 1.2, 0.55, pan=px(1000)); vcs(F4, tTo + 0.1, tTo + 2.8, 0.55, pan=px(1100))
rec(F2, tJb + 0.2, tTk + 1.6, 0.55, pan=px(1300)); rec(Bb2, tTo + 0.3, tTo + 2.8, 0.55, pan=px(1300))
tTh = C2('builds', 'three earlier films')
for i in range(3):
    knock(tTh - 0.2 + 0.3 * i, 0.009, px(560), 250)
vcs(Db4, tTh + 0.1, tTh + 2.6, 0.55, pan=px(700)); vcs(Ab4, tTh + 1.0, tTh + 2.6, 0.5, pan=px(700))
knock(C2('builds', 'Microsoft Entra ID', -0.1), 0.010, px(300), 240)
tT = G('card', 'breath', 0.3)
rec(Ab2, tT, tT + 1.6, 0.7, pan=-0.05); rec(Db3, tT + 1.65, E('card') - 0.4, 0.7, pan=-0.05)
pins([(Db4, tT + 0.2), (F4, tT + 1.1), (Ab4, tT + 2.0)], E('card') - 0.3, 0.75, 0.05, rel=0.8)

# 3. Still a key: at the turn, Sam on the recorder, D flat, and F above it. Pages laid down; the 214, a pill; nineteen moved on,
#    still in: B flat and D flat. Groups the directory knew nothing of: a slip. Eleven admins: one breath. The fake page fills: a line
#    falling to B flat. A password, a card. Jun's token: a card and its sealed card. Like the hotel keys: the key, its knock, and
#    B-flat minor again, B flat and F
B = lambda lid, word, off=0: W('before', lid, word, off)
b0 = S0('before')
rec(Db3, b0 + 0.3, b0 + 2.9, 0.6, pan=px(330)); vcs(F4, b0 + 0.6, b0 + 2.9, 0.45, pan=px(500))
knock(G('before', 'sam', -0.1), 0.010, px(480), 240)
paper(B('tables', 'give their rights', -0.3), 0.008, px(1390))
knock(B('tables', 'Governed in Unity Catalog', -0.2), 0.009, px(940), 240)
paper(G('before', 'hand', 0.6), 0.008, px(1390))
knock(B('people', 'two hundred', -0.1), 0.010, px(1840), 240)
tMv = G('before', 'moved', 0.3)
tap(tMv, 0.007, px(1390)); knock(tMv + 0.05, 0.010, px(940), 220)
vcs(Bb3, tMv + 0.1, tMv + 2.2, 0.5, pan=px(1300)); vcs(Db4, tMv + 0.95, tMv + 2.2, 0.45, pan=px(1300))
paper(G('before', 'groups', -0.2), 0.008, px(1390))
knock(B('groups', 'the directory knew nothing', -0.1), 0.010, px(940), 220)
paper(G('before', 'admins', -0.1), 0.008, px(1550))
air(G('before', 'admins', 0.05), 1.4, 0.006, px(1550), 200, 1000)
tFk = G('before', 'fake')
paper(tFk - 0.2, 0.008, px(660))
line(((F4, 0.6), (Db4, 0.6), (Bb3, 1.9)), tFk + 0.4, 0.55, px(700))
dull(B('fake', 'would catch an admin', -0.2), 0.011, px(1540))
knock(G('before', 'password', -0.1), 0.010, px(660), 240)
tTn = G('before', 'token')
knock(tTn - 0.2, 0.010, px(900), 240); paper(tTn + 0.6, 0.008, px(900))
tSl3 = G('before', 'still')
knock(tSl3 - 0.1, 0.011, px(1190), 520)
pins([(Bb3, tSl3), (F4, tSl3 + 1.0)], B('still', 'long after the stay', 1.8), 0.55, px(1250))
knock(B('still', 'long after the stay', -0.1), 0.010, px(1300), 240)

# 4. One directory: at the turn, the directory's drawers, G-flat major pin by pin, over the recorder's A flat. HR's records, a slip; a
#    new person moves into a group, a moved one across, on a breath; one who left, greyed: a dull knock. Azure Databricks reads it for
#    itself, a group inside a group: their slips. The account's automatic identity management switched on: a click, and D flat and
#    A flat. Production given groups: a tap for each; groups only. The four made by hand fold away on one breath. Each sign-in reads
#    the groups again: a breath along the line; the platform follows: F and A flat. Someone who left, turned off at the next sync: E
#    flat to D flat
D4 = lambda lid, word, off=0: W('directory', lid, word, off)
d0 = S0('directory')
rec(Ab2, d0 + 0.4, d0 + 3.4, 0.6, pan=px(400))
pins([(Bb3, d0 + 1.0), (Db4, d0 + 1.9), (Gb4, d0 + 2.8)], d0 + 4.4, 0.55, px(460))
tHR = D4('entra', "HR's records")
knock(tHR - 0.2, 0.009, px(880), 240); air(tHR + 0.2, 0.6, 0.005, px(700), 200, 1000)
tTm = D4('joins', "already in their team's groups")
air(tTm - 0.3, 1.2, 0.006, px(880), 180, 900); tap(tTm + 0.9, 0.007, px(880))
air(D4('moves', 'their groups change', -0.1), 1.4, 0.006, px(880), 180, 900)
knock(D4('moves', 'when they leave', -0.2), 0.010, px(880), 240)
dull(D4('moves', 'turned off', -0.1), 0.010, px(880))
knock(G('directory', 'reads', -0.2), 0.009, px(1426), 240)
knock(D4('reads', 'groups inside groups', -0.1), 0.009, px(600), 260)
tAi = G('directory', 'aim')
paper(tAi - 0.2, 0.008, px(1420))
tOn = D4('aim', 'automatic identity management', 0.5)
click(tOn, 0.010, px(1100))
pins([(Db4, tOn), (Ab4, tOn + 0.9)], tOn + 2.9, 0.55, px(1300))
paper(G('directory', 'given', -0.1), 0.008, px(1420))
knock(D4('given', 'never people', -0.1), 0.010, px(1840), 240)
for w_, off_ in (('the data team', -0.1), ("the registrar's office", -0.1), ('the readers', -0.1), ('the readers', 0.3)):
    tap(D4('prod', w_, off_), 0.006, px(1250))
tGo = G('directory', 'gone')
paper(tGo - 0.1, 0.008, px(1420)); air(tGo + 0.6, 2.0, 0.006, px(1250), 180, 900)
knock(D4('gone', 'their people', -0.1), 0.010, px(980), 240)
paper(G('directory', 'one', -0.1), 0.008, px(1420))
air(D4('signs', 'reads their groups again', -0.3), 1.4, 0.007, px(1100), 180, 1000)
knock(G('directory', 'follows', -0.2), 0.009, px(880), 240)
tNx = D4('follows', 'at their next sign-in')
air(tNx - 0.3, 1.4, 0.007, px(1100), 180, 1000)
vcs(F4, tNx + 0.9, tNx + 3.0, 0.5, pan=px(1200)); vcs(Ab4, tNx + 1.8, tNx + 3.0, 0.45, pan=px(1200))
tSy = D4('leaves', 'at its next sync')
paper(tSy - 0.2, 0.008, px(1535)); dull(tSy + 0.3, 0.011, px(1700))
line(((Eb4, 0.6), (Db4, 2.0)), tSy + 0.5, 0.5, px(1500))

# 5. Sign in once: at the turn, three people sign in, each a note of the recorder as their disc runs to the door (A flat, D flat,
#    F), over D flat and A flat. The directory's rule: a page, and a pin as each line lights, A flat, D flat, F; no fake page can catch
#    it: its pill. Where a passkey lives: the phone, the key, their slips. Mei signs in: her face, a breath; the tick; she's in: F and
#    A flat. The fake page gets nothing: a dull knock. The confidentiality agreement: its card; accepted: a tick, and G flat over D flat;
#    again each year: its pill. Who accepted, and when: one breath as the dates come
S5 = lambda lid, word, off=0: W('signin', lid, word, off)
s0 = S0('signin'); tOc = G('signin', 'once')
rline(((Ab2, 0.8), (Db3, 0.8), (F3, 2.2)), tOc + 0.5, 0.6, px(1100))
vcs(Db4, tOc + 1.3, tOc + 4.0, 0.42, pan=px(1300)); vcs(Ab4, tOc + 2.2, tOc + 4.0, 0.38, pan=px(1300))
for i in range(3):
    air(tOc + 0.5 + 0.8 * i, 1.5, 0.004, px(1000), 200, 1000)
tRu = G('signin', 'rule')
paper(tRu + 0.35, 0.008, px(1410))
pins([(Ab3, S5('rule', 'lets no one', -0.1)), (Db4, S5('rule', 'reach Azure Databricks', -0.1)), (F4, S5('rule', 'without a passkey', -0.1))],
     S5('rule', 'no fake page can catch', 1.2), 0.5, px(1410))
knock(S5('rule', 'no fake page can catch', -0.1), 0.010, px(1410), 240)
tKt = max(S5('lives', 'their own phone', -0.2), G('signin', 'lives', 0.25))
tap(tKt, 0.007, px(280)); tap(tKt + 0.3, 0.006, px(284))
knock(S5('lives', 'the Authenticator app', -0.1), 0.009, px(280), 240)
knock(S5('lives', 'a security key', -0.1), 0.010, px(640), 300)
tMe = G('signin', 'mei')
knock(tMe + 0.1, 0.009, px(1060), 240)
paper(S5('mei', 'signs in with her phone', -0.3), 0.008, px(500))
air(S5('mei', 'her face unlocks'), 1.0, 0.005, px(1420), 300, 1400)
tUn = S5('mei', 'unlocks the passkey', 0.4)
tap(tUn, 0.008, px(1420))
vcs(F4, S5('mei', "she's in", -0.1), S5('mei', "she's in", 2.6), 0.5, pan=px(900)); vcs(Ab4, S5('mei', "she's in", 0.8), S5('mei', "she's in", 2.6), 0.45, pan=px(900))
dull(S5('none', 'a fake page could use', -0.1), 0.010, px(500))
tAg = G('signin', 'agree')
paper(S5('agree', 'confidentiality agreement', 0.3), 0.008, px(1320))
knock(S5('agree', 'first film', -0.2), 0.010, px(960), 240)
tAc = S5('before', 'before accepting it', 0.2)
tap(tAc + 0.5, 0.008, px(1320))
vcs(Db4, tAc + 0.5, tAc + 2.8, 0.45, pan=px(1200)); vcs(Gb4, tAc + 1.4, tAc + 2.8, 0.42, pan=px(1200))
knock(S5('before', 'again each year', -0.1), 0.010, px(1680), 240)
paper(G('signin', 'keeps'), 0.008, px(1400)); air(S5('keeps', 'and when', -0.1), 0.9, 0.005, px(1650), 200, 1000)

# 6. Power you borrow: at the turn, groups no one is in: D flat and G flat, and no recorder. Each admin role belongs to one: a card for
#    each. The emergency accounts, their slip. Sam and Jun, and their second accounts: cards; a touch on the security key. The switch,
#    privileged identity management: its slip; eligible, never in them: a breath along the dotted lines, and A flat with E flat, open.
#    19 October: its tag; the token report, locked. Sam asks for an hour, and types why; Jun approves. Within seconds his admin account
#    is in the group: the mark's switch-on, A flat and D flat with E flat joining for the task. The alert: its page, a tap for each line.
#    For this hour he can read the report: the lock opens, and E flat, the task's note, alone. He signs out; the hour is up, and the
#    directory takes his account out: E flat leaves cleanly, and A flat and D flat go on without it. Like a new pattern in the hotel's
#    lock: the cards slide in and out, and green: D flat and F
P6 = lambda lid, word, off=0: W('power', lid, word, off)
p0 = S0('power'); tGr = G('power', 'groups')
air(tGr + 0.2, 1.6, 0.005, px(640), 200, 1000)
pins([(Db4, tGr + 0.3), (Gb4, tGr + 1.2)], tGr + 3.3, 0.5, px(640))
for w_, y_ in (('in the Databricks account', 180), ('in each workspace', 350), ('in Azure', 520)):
    knock(P6('roles', w_, -0.1), 0.010, px(1400), 240)
knock(P6('roles', 'in Azure', 1.0), 0.009, px(400), 240)
tSJ = P6('two', 'Sam and Jun')
knock(tSJ - 0.1, 0.009, px(1600), 240); knock(tSJ + 0.4, 0.009, px(1600), 240)
knock(P6('two', 'a second account', -0.1), 0.010, px(1200), 240)
tap(P6('two', 'a security key', -0.1), 0.008, px(1300))
knock(P6('pim', 'privileged identity management', -0.2), 0.009, px(1100), 240)
tEl = P6('pim', 'eligible for the groups', -0.2)
air(tEl, 0.9, 0.005, px(760), 200, 1000)
vcs(Ab3, tEl + 0.3, tEl + 3.0, 0.45, pan=px(760)); vcs(Eb4, tEl + 1.2, tEl + 3.0, 0.42, pan=px(760))
knock(P6('pim', 'never in them', -0.1), 0.009, px(940), 240)
tRp = G('power', 'report')
knock(tRp + 0.1, 0.010, px(400), 240)
paper(P6('report', "the account's token report", -0.2), 0.008, px(1390))
lock(P6('report', 'only an account admin', -0.1), 0.009, px(1390))
tHr = G('power', 'hour')
paper(tHr - 0.1, 0.008, px(1390)); knock(P6('hour', 'for one hour', -0.1), 0.009, px(1300), 240)
typing(P6('hour', 'types why', -0.1), 1.2, 0.005, px(1200))
knock(G('power', 'approves', -0.1), 0.010, px(1100), 240)
tIn = P6('seconds', 'in the group')
air(tIn - 0.7, 0.7, 0.006, px(780), 200, 1000)
click(tIn, 0.010, px(560))
vcs(Ab3, tIn - 0.6, tIn + 2.8, 0.45, pan=px(700)); vcs(Db4, tIn - 0.6, tIn + 2.8, 0.42, pan=px(700))
task(Eb5, tIn, tIn + 2.8, 0.4, pan=px(560))
knock(tIn + 0.2, 0.009, px(900), 240)
paper(G('power', 'alert', -0.2), 0.008, px(1420))
for w_ in ('who', 'which group', 'why', 'who approved', 'until when'):
    tap(P6('alert', w_, -0.1), 0.006, px(1300))
tSi = P6('reads', 'as he signs in')
paper(tSi - 0.2, 0.008, px(1420)); tap(tSi - 0.2, 0.007, px(900))
tCn = P6('reads', 'he can read the report', -0.1)
lock(tCn, 0.009, px(1420))
task(Eb5, tCn + 0.1, tCn + 2.2, 0.38, pan=px(1420))
knock(P6('out', 'he signs out', -0.1), 0.009, px(1120), 240)
knock(P6('out', 'the hour is up', 0.2), 0.009, px(900), 240)
tTa = P6('out', 'takes his admin account out')
air(tTa, 0.8, 0.006, px(780), 200, 1000); click(tTa + 0.6, 0.009, px(560))
vcs(Ab3, tTa - 0.1, tTa + 3.4, 0.45, pan=px(700)); vcs(Db4, tTa - 0.1, tTa + 3.4, 0.42, pan=px(700))
task(Eb5, tTa - 0.1, tTa + 0.6, 0.38, pan=px(560))
tPt = P6('like', 'a new pattern')
slide(tPt - 0.4, 0.007, px(1330), 0.5); slide(tPt + 0.2, 0.007, px(1330), 0.5)
tOp = P6('like', 'opens one stay')
slide(tOp - 0.3, 0.008, px(1100), 0.6)
vcs(Db4, tOp + 1.0, P6('like', 'ends with it', 1.6), 0.45, pan=px(1330)); vcs(F4, tOp + 1.9, P6('like', 'ends with it', 1.6), 0.42, pan=px(1330))
slide(P6('like', 'ends with it'), 0.007, px(1100), 0.6)

# 7. No token to copy: at the turn, seven tokens: B-flat minor, the recorder's F under B flat and D flat; the rows on one breath; Jun's,
#    coral; the command lines, a pill. Noor's command line signs in through the browser: keys typed; her face, the tick, signed in:
#    D flat to F. The CLI's own short pass slides into the secure store; nothing to copy or paste: its pill. The six end their own
#    tokens: a tap for each. Workloads without secrets, its tag; Jun's token stamped ended: A flat, D flat and F, home. 3 November,
#    its tag. That afternoon the workspaces' settings switched on for thirty minutes: a click, D flat and A flat with E flat joining
#    for the task; approved, its pill; personal tokens switched off: a click; no one can make or use one. The groups switched off
#    again: E flat leaves cleanly, and the chord goes on without it, A flat and D flat
T7 = lambda lid, word, off=0: W('tokens', lid, word, off)
t0 = S0('tokens')
rec(F2, t0 + 0.4, t0 + 3.4, 0.6, pan=px(500)); pins([(Bb3, t0 + 0.8), (Db4, t0 + 1.7)], t0 + 3.6, 0.5, px(500))
air(G('tokens', 'seven', 0.2), 1.2, 0.005, px(540), 200, 1000)
dull(T7('seven', "and Jun's", -0.1), 0.010, px(540))
knock(T7('seven', 'for their command lines', -0.1), 0.009, px(990), 240)
tBr = G('tokens', 'browser')
knock(tBr + 0.1, 0.009, px(400), 240)
typing(tBr + 0.3, 0.9, 0.005, px(1400)); typing(tBr + 1.2, 1.0, 0.004, px(1400))
tSm = T7('browser', 'the same passkey')
paper(T7('browser', 'through the browser', -0.2), 0.008, px(1300))
air(tSm - 0.1, 0.9, 0.005, px(1300), 300, 1400); tap(tSm + 0.6, 0.008, px(1300)); knock(tSm + 1.1, 0.009, px(1800), 240)
vcs(Db4, tSm + 1.0, tSm + 3.2, 0.45, pan=px(1300)); vcs(F4, tSm + 1.9, tSm + 3.2, 0.42, pan=px(1300))
paper(T7('cli', 'short passes', -0.1), 0.008, px(1200))
slide(T7('cli', "the computer's secure store", -0.2), 0.008, px(1200), 0.9)
knock(T7('cli', 'nothing to copy', -0.1), 0.010, px(1800), 240)
tEd = T7('six', 'end their own tokens')
for j in range(6):
    tap(tEd + 0.25 * j, 0.006, px(780))
knock(T7('jun', 'Workloads without secrets', -0.2), 0.009, px(300), 240)
tSt7 = T7('jun', 'ends it', 0.1)
stamp(tSt7, 0.013, px(830))
pins([(Ab3, tSt7 + 0.05), (Db4, tSt7 + 0.95), (F4, tSt7 + 1.85)], tSt7 + 3.6, 0.5, px(800))
knock(T7('jun', 'third of November', -0.3), 0.010, px(400), 240)
tSw = T7('off', 'switches on', 0.3)
knock(tSw - 0.5, 0.009, px(1200), 240); click(tSw, 0.010, px(560))
vcs(Db4, tSw - 0.2, tSw + 2.6, 0.42, pan=px(800)); vcs(Ab4, tSw - 0.2, tSw + 2.6, 0.4, pan=px(800))
task(Eb5, tSw + 0.1, tSw + 2.6, 0.36, pan=px(560))
knock(T7('off', 'thirty minutes', -0.1), 0.009, px(1470), 240)
knock(T7('off', 'Jun approves', -0.1), 0.009, px(1470), 240)
tTu = T7('off', 'turns personal tokens off')
paper(tTu - 1.2, 0.008, px(1420)); knock(tTu + 0.1, 0.008, px(1800), 240); click(tTu + 0.4, 0.010, px(1100))
knock(tTu + 1.0, 0.009, px(1100), 240)
knock(T7('none', 'no one can make', -0.1), 0.010, px(1100), 240)
tGf = G('tokens', 'none', 1.2)
click(tGf + 0.3, 0.008, px(560))
vcs(Ab3, tGf - 0.1, tGf + 3.0, 0.42, pan=px(800)); vcs(Db4, tGf - 0.1, tGf + 3.0, 0.4, pan=px(800))
task(Eb5, tGf - 0.1, tGf + 0.6, 0.34, pan=px(560))

# 8. Ends with the stay: the hotel's corridor of the 1970s, its card lock green: the recorder's A flat, D flat and F above it; a lost
#    card, a dull knock. At the university, what now ends with the stay: a knock as each tag turns green. The end: the people on the
#    recorder, D flat, and the mark, D flat, F, A flat, pin by pin; power is borrowed: E flat joins, and is not kept: it leaves, and the
#    chord goes on to the end
C8 = lambda lid, word, off=0: W('close', lid, word, off)
e0 = S0('close')
rec(Ab2, e0 + 0.3, e0 + 3.2, 0.6, pan=0.0); vcs(Db4, e0 + 0.5, e0 + 3.2, 0.45, pan=px(990)); vcs(F4, e0 + 1.4, e0 + 3.2, 0.4, pan=px(990))
dull(C8('hotels', 'a lost card opened nothing', -0.1), 0.010, px(560))
for t_ in (C8('uni', 'ends with the job', -0.1), C8('uni', 'ends with the task', -0.1), G('close', 'token', 0.1)):
    knock(t_, 0.010, px(560), 240)
tTk8 = G('close', 'take', -0.3)
rec(Db3, tTk8, E('close') - 2.4, 0.6, pan=0.0)
pins([(Db4, tTk8 + 0.2), (F4, tTk8 + 1.1), (Ab4, tTk8 + 2.0)], E('close') - 2.2, 0.6, 0.0, rel=0.9)
task(Eb5, C8('take', 'borrowed', -0.1), C8('take', 'not kept', 0.5), 0.36, pan=0.1)
