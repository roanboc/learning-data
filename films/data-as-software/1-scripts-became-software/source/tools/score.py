# Scripts became software: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film by the module's setup thread on 5 November 2026 and checked against
# every film's palette (/mnt/project-files/modern-data-basics/palettes.md): two ophicleides, made here (music.py has neither).
#  - The lead: an ophicleide, the keyed brass bass of 1817 that replaced the serpent's finger holes with keys laid out on a plan, so
#    every note came out the same, whoever played: a hand's craft made exact by a plan. Played softly and low, with no vibrato,
#    hollow and plain: a wide, conical bore, so every harmonic sounds, the body's warmth near 400 Hz, a little hollow in its second
#    harmonic, soft above 800 Hz and nothing above 2.2 kHz; the higher harmonics speak a moment after the first, as a brass note's do,
#    with the faint buzz of the lips as it starts.
#  - The partner: a second ophicleide, an octave higher, reading the same part: two players, one plan. It joins the lead where
#    someone other than the author reads the work, and a person's approval is its rising fourth, D to G.
#  - The mark: a phrase (G, B, D, C, B, G) played once by the lead alone, a little uneven (each note a little early or late, a little
#    louder or softer), then by both players together, note for note: the bridge of 1940 and the bridge of 1950, the script run by hand
#    and the release that runs the same way every time, and the end card.
#  - G major for the work and the plan; E minor for the problem (the untested deck, the spreadsheets that stopped coming); C major
#    where something has to change; D major for the tests that find the answer. Just intonation from G (hz()), so every chord is pure.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; no urgent pulse (film.json's "urgent" is empty: nothing
#    in this story is a rush).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen is one soft sound.
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
R1 = np.random.default_rng(1817)  # this film's own randomness: the room, the breath, the wind and the water

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G major (G B D),
# C major (C E G), D major (D F sharp A), E minor (E G B) and B minor (B D F sharp) are all pure in this table; A with E is not
# (40/27), so no A minor chord, and A sounds only with D or F sharp
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (55, 195.998)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, E4, Fs4, G4, A4, B4, C5, D5 = 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74
E2 = 40
MARK = (G3, B3, D4, C4, B3, G3)  # the mark: the lead's part; the partner reads it an octave higher

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the partner a little under the lead; the effects about 16 dB under
# the music (FX scales them all)
OL, FX = 0.053, 2.2

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held()),
# as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so
    the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- an ophicleide, played softly: every harmonic of a wide conical bore, the body's warmth near 400 Hz, the second harmonic a little
# weak (its hollow sound), soft above 800 Hz and nothing above 2.2 kHz. The higher harmonics speak a moment after the first; the lips'
# faint buzz as the note starts. Held steady, with no vibrato; a note of 1.2 s or more swells a little and eases, once
def oph(m, a, b, g=1.0, att=0.11, rel=0.4, pan=0.0, room=0.28):
    f = hz(m); sec = max(0.2, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(2200 // f) + 1):
        fk = f * k
        w = (1 + 0.9 * np.exp(-((fk - 400) / 230) ** 2)) * np.exp(-max(0.0, fk - 800) / 380) / k ** 0.65
        if k == 2:
            w *= 0.72
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.2 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.7 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.41 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    lips = filt(noise(n / SR + 0.01)[:n], 'band', (250, 1200)) * 0.012 * np.exp(-x / 0.05)
    put(_held(filt((s + lips).astype(np.float32), 'low', 2200), room), a, g * OL, pan)
LEAD, PART = -0.18, 0.2   # where the two players sit
def lead(m, a, b, g=1.0, **k):
    oph(m, a, b, g, pan=k.pop('pan', LEAD), **k)
def part(m, a, b, g=0.7, **k):
    oph(m, a, b, g, pan=k.pop('pan', PART), **k)
def mark(s, exact=True, g=1.0, step=0.42, last=1.8):
    """the mark: the lead alone, a little uneven, or both players together, note for note"""
    dt = (0.0, 0.08, -0.05, 0.12, -0.03, 0.07) if not exact else (0,) * 6
    dg = (1.0, 0.8, 1.1, 0.84, 0.96, 0.9) if not exact else (1,) * 6
    dl = (0.95, 0.78, 1.05, 0.74, 1.0, 0.85) if not exact else (1,) * 6
    for i, m in enumerate(MARK):
        a = s + step * i + dt[i]; b = a + (step * 0.94 * dl[i] if i < len(MARK) - 1 else last * dl[i])
        lead(m, a, b, g * dg[i] * 0.95, att=0.09, rel=0.32 if i < len(MARK) - 1 else 0.9)
        if exact:
            part(m + 12, a, b, g * 0.6, att=0.09, rel=0.32 if i < len(MARK) - 1 else 0.9)
def approve(s, g=0.7, hold=1.3, pan=PART):
    """a person approves: the partner's rising fourth, D to G"""
    part(D4, s, s + 0.36, g * 0.9, att=0.08, rel=0.2, pan=pan); part(G4, s + 0.42, s + 0.42 + hold, g, att=0.1, rel=0.8, pan=pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a row lit, a check"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def stamp(s, g=0.016, pan=0.0):
    """merged, or approved: a low knock and the slap of a stamp's pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def wind(s, sec, g=0.006, pan=0.0, lo=110, hi=650, rise=0.35):
    """the wind on the water: one soft texture that swells in, holds and fades, never gusts"""
    x = tt(sec); e = np.minimum(1, np.minimum(x / (sec * rise), (sec - x) / (sec * 0.3)))
    X(filt(noise(sec), 'band', (lo, hi))[:len(x)] * np.sin(0.5 * np.pi * np.clip(e, 0, 1)) ** 2, s, g * FX, pan)
def tear(s, g=0.012, pan=0.0):
    """the deck tears: a low crack, short and soft"""
    s_knock(s, g * FX, pan, 120); x = tt(0.2); X(filt(noise(0.2), 'band', (180, 1000))[:len(x)] * np.exp(-x / 0.05), s + 0.01, g * 0.7 * FX, pan)
def splash(s, g=0.011, pan=0.0):
    """a piece of the deck meets the water: a low thump and the water closing over it"""
    s_knock(s, g * 0.8 * FX, pan, 90); x = tt(1.1)
    X(filt(noise(1.1), 'band', (120, 900))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / 0.28), s + 0.02, g * FX, pan)
def keys(s, n, g=0.006, pan=0.0, step=0.16):
    """a few keys on the laptop, never a burst"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.7, pan)

# =============================================================================================================================
# 1. Galloping Gertie: the opening, with music under the story.
#    1 July 1940: G major, the lead's low G and the partner rising. The bridge built across: the lead's D falling to G. Light and
#    slender, built to the best theory of its day: the mark, the lead alone, a little uneven. Galloping Gertie: the wind swells in;
#    the partner's B. Nobody had tested it: E minor, the lead's low E. The twist: the wind rises; the lead's B; the deck tears (a low
#    crack, the music stops), the pieces meet the water, and the partner falls B, G, E. Gone for ten years: E held; "Something had to
#    change": C major. The engineers' report: G and D, open; the tunnel's steady wind. Farquharson tests for years: the partner, B to
#    C to D, slowly. The tests find the deck: D major, a tick for each word. 1950, tested before it was built: the mark, both players,
#    note for note; 76 years: G held. A practice from next door: C to G as each row lights. Data work did the same: D to G. Payroll's
#    export, on one laptop: E minor, the lead alone. Now it's software: a note for each of the three, and the title card in G major
g0 = S0('gertie')
Gt = lambda lid, word, off=0: W('gertie', lid, word, off)
lead(G2, g0 + 0.3, Gt('narrows', 'new bridge', 0.2), 0.85, att=1.4, rel=1.2)
part(G3, Gt('opens', 'Washington', 0.0), Gt('opens', 'Washington', 0.9), 0.55, att=0.3, rel=0.4)
part(B3, Gt('opens', 'first of July', 0.0), Gt('opens', 'first of July', 0.9), 0.55, att=0.25, rel=0.4)
part(D4, Gt('opens', 'nineteen forty', 0.0), Gt('narrows', 'new bridge', 0.4), 0.55, att=0.25, rel=0.9)
# the bridge builds itself across the Narrows: the deck stretching across, a breath of air; the lead D to G, the partner B
tB = Gt('narrows', 'new bridge', -0.4)
air(tB + 0.2, 3.6, 0.006, 0.0, 140, 700)
lead(D3, tB + 0.5, tB + 2.2, 0.75, att=0.4, rel=0.5); lead(G2, tB + 2.3, Gt('narrows', 'suspension bridge', 0.6), 0.75, att=0.5, rel=1.0)
part(B3, tB + 2.4, tB + 4.6, 0.5, att=0.6, rel=0.9)
part(D4, Gt('narrows', 'two great cables', 0.0), Gt('narrows', 'suspension bridge', 0.8), 0.45, att=0.4, rel=1.0)
# light and slender, built to the best theory of its day: the mark, the lead alone, a little uneven
mark(Gt('slender', 'light and slender', -0.1), exact=False, g=0.9)
# Galloping Gertie: the wind on the water swells in as the deck rises and falls; the partner's B, lightly
wind(Gt('gertie', 'in the wind', -1.2), 10.5, 0.005, 0.0, 110, 600, 0.3)
part(B3, Gt('gertie', 'Galloping Gertie', -0.05), Gt('gertie', 'Galloping Gertie', 1.0), 0.5, att=0.15, rel=0.5)
part(D4, Gt('gertie', 'Galloping Gertie', 0.45), Gt('gertie', 'Galloping Gertie', 1.4), 0.45, att=0.15, rel=0.6)
# nobody had tested how wind would move a deck like it: E minor, the lead's low E, the partner's G and B
tN = Gt('nobody', 'Nobody', -0.1)
lead(E2, tN, Gt('twist', 'seventh of November', 0.2), 0.8, att=0.6, rel=1.0)
part(G3, tN + 0.3, tN + 1.9, 0.45, att=0.4, rel=0.5); part(B3, tN + 1.9, Gt('twist', 'seventh of November', 0.0), 0.45, att=0.4, rel=0.8)
# 7 November: the wind rises to forty miles an hour and sets the deck twisting; the lead's B under it, the partner's E
wind(Gt('twist', 'forty miles', -0.8), Gt('twist', 'tears away', 0.9) - Gt('twist', 'forty miles', -0.8), 0.007, 0.0, 120, 700, 0.4)
lead(B2, Gt('twist', 'twisting', -0.6), Gt('twist', 'tears away', -0.05), 0.75, att=0.8, rel=0.25)
part(E3, Gt('twist', 'twisting', -0.2), Gt('twist', 'tears away', -0.05), 0.42, att=0.8, rel=0.25)
# the middle tears away and falls into the water: a low crack, the music stops; each piece meets the water where it falls
tT = Gt('twist', 'tears away')
tear(tT, 0.012, 0.0)
_hit = lambda k, dl: tT + dl + float(np.sqrt(2 * (792 - 606) / 260))
for k, (dl, x) in enumerate(((0.0, 771), (0.22, 960), (0.42, 1149))):
    splash(_hit(k, dl), 0.010 if k == 1 else 0.008, px(x))
# then the partner falls, B to G to E, as the water closes
tF = _hit(2, 0.42) + 0.9
part(B3, tF, tF + 0.7, 0.42, att=0.2, rel=0.4); part(G3, tF + 0.75, tF + 1.45, 0.42, att=0.2, rel=0.4); part(E3, tF + 1.5, tF + 2.8, 0.42, att=0.25, rel=0.9)
# no one is killed, but the only road is gone for ten years: E held; "Something had to change": C major
lead(E2, Gt('gone', 'No one', -0.2), Gt('gone', 'Something had to change', -0.1), 0.7, att=0.8, rel=0.6)
tC = Gt('gone', 'Something had to change', -0.05)
lead(C3, tC, END('gertie', 'gone') + 1.0, 0.75, att=0.35, rel=1.0)
part(E3, tC + 0.15, END('gertie', 'gone') + 1.0, 0.45, att=0.4, rel=1.0); part(G3, tC + 0.6, END('gertie', 'gone') + 1.0, 0.4, att=0.4, rel=1.0)
# the engineers' report, set down; test bridges like it first, as models in a wind tunnel: G and D, open
knock(G('gertie', 'board', -0.2), 0.013, px(590), 240)
tW = Gt('board', 'wind tunnel', -0.3)
lead(G2, tW, Gt('board', 'a fan blows', 0.4), 0.65, att=0.6, rel=0.8); part(D4, tW + 0.4, Gt('board', 'a fan blows', 0.4), 0.4, att=0.6, rel=0.8)
# the tunnel's fan blows a steady wind past the model, until the new deck is found
wind(Gt('board', 'a fan blows', -0.3), Gt('finds', 'find a deck', -0.3) - Gt('board', 'a fan blows', -0.3), 0.004, px(1230), 160, 800, 0.2)
# Frederick Farquharson tests models for years: the partner, slowly, B to C to D
tY = Gt('tunnel', 'Frederick', -0.2)
part(B3, tY, tY + 1.3, 0.42, att=0.3, rel=0.5); part(C4, tY + 1.5, tY + 2.8, 0.42, att=0.3, rel=0.5); part(D4, tY + 3.0, Gt('finds', 'find a deck', -0.2), 0.42, att=0.3, rel=0.7)
lead(G2, tY + 0.2, tY + 3.2, 0.5, att=0.8, rel=0.8)
# the tests find a deck the wind can't twist: D major; steady in the wind; deeper, stiffer, open: a tick for each
tD = Gt('finds', 'find a deck', -0.1)
lead(D3, tD, Gt('finds', 'open to let', 1.6), 0.65, att=0.4, rel=0.8)
part(Fs3, tD + 0.2, tD + 1.6, 0.4, att=0.3, rel=0.4); part(A3, tD + 1.6, Gt('finds', 'open to let', 1.6), 0.4, att=0.3, rel=0.8)
tap(Gt('finds', "can't twist", -0.1), 0.008, px(1348))
for w_, x in (('deeper', 640), ('stiffer', 826), ('open to let', 1006)):
    tap(Gt('finds', w_, -0.15), 0.007, px(x + 60))
# 1950, tested before it was built: the mark, both players, note for note; 76 years of traffic: G held, the pill set down
mark(Gt('opens50', 'nineteen fifty', -0.2), exact=True, g=0.9)
lead(G2, Gt('opens50', 'carried traffic', -0.3), END('gertie', 'opens50') + 0.8, 0.6, att=0.6, rel=1.0)
part(B3, Gt('opens50', 'carried traffic', 0.0), END('gertie', 'opens50') + 0.8, 0.38, att=0.6, rel=1.0)
knock(Gt('opens50', 'seventy-six', -0.1), 0.012, px(960), 260)
air(Gt('opens50', 'carried traffic', -0.4), 2.2, 0.005, px(700), 150, 800)
# a practice from next door: the first row, wings, then bridges; data work did the same, and took up software's way: the second row
knock(Gt('next', "weren't new", -0.3), 0.012, px(505), 240)
lead(C3, Gt('next', "weren't new", -0.2), Gt('next', 'Wright brothers', 0.8), 0.6, att=0.5, rel=0.8)
part(E4, Gt('next', 'Wright brothers', -0.1), Gt('next', 'Wright brothers', 1.0), 0.38, att=0.3, rel=0.6)
tBr = Gt('next', 'Bridges took up', 0.0)
knock(tBr + 0.6, 0.011, px(1415), 240)
lead(G2, tBr, END('gertie', 'next') + 0.4, 0.6, att=0.4, rel=0.8); part(D4, tBr + 0.3, END('gertie', 'next') + 0.4, 0.38, att=0.4, rel=0.8)
knock(Gt('data', 'Data work', -0.3), 0.012, px(505), 240)
tSw = Gt('data', 'software', 0.0)
lead(D3, tSw - 0.4, tSw + 0.7, 0.55, att=0.25, rel=0.3); lead(G2, tSw + 0.75, tSw + 2.4, 0.55, att=0.3, rel=0.9)
part(Fs3, tSw - 0.2, tSw + 0.7, 0.36, att=0.25, rel=0.3); part(G3, tSw + 0.75, tSw + 2.4, 0.36, att=0.3, rel=0.9)
knock(tSw + 0.9, 0.011, px(1415), 240)
# at the university: payroll's export, a script on one person's laptop: E minor, the lead alone, low; the laptop opens
tPe = Gt('export', 'a script', -0.4)
knock(tPe, 0.010, px(530), 220); keys(Gt('export', 'a script', 0.1), 3, 0.005, px(530), 0.22)
lead(E2, Gt('export', "payroll's export", -0.3), Gt('export', 'laptop', 1.4), 0.6, att=0.8, rel=1.0)
# now it's software: tested before every change, reviewed by someone else, released the same way every time: a note for each
lead(G2, Gt('now', 'software', -0.2), Gt('now', 'released', 1.8), 0.55, att=0.6, rel=0.9)
for k, (w_, m) in enumerate((('tested before', G3), ('reviewed', B3), ('released', D4))):
    tw = Gt('now', w_, -0.15)
    part(m, tw, tw + 1.1, 0.42, att=0.12, rel=0.6)
# the title card: G major, both players
tTi = G('gertie', 'breath', 0.2)
lead(G2, tTi, E('gertie') - 0.3, 0.75, att=0.5, rel=1.4); lead(D3, tTi + 0.3, E('gertie') - 0.3, 0.5, att=0.5, rel=1.4)
part(B3, tTi + 0.5, E('gertie') - 0.3, 0.42, att=0.5, rel=1.4); part(G4, tTi + 0.8, E('gertie') - 0.3, 0.32, att=0.5, rel=1.4)

# 2. A script on a laptop: pay day, the lead's low G and the partner's B. Rohan's card. Before six, by hand, emailed: the mark, the lead
#    alone, a little uneven, as the script runs by hand; the envelope. Payroll's rule inside it: its card. It worked: a tick. In
#    February the spreadsheets stop: E minor, the lead's E and the partner's G. One copy, no history, no test: a low knock for each,
#    and in the pause before the next chapter, the lead's B falling to E
L2 = lambda lid, word, off=0: W('laptop', lid, word, off)
l0 = S0('laptop')
lead(G2, l0 + 0.4, L2('payday', 'pay day', 1.0), 0.6, att=0.8, rel=1.0); part(B3, l0 + 0.8, L2('payday', 'pay day', 1.0), 0.36, att=0.6, rel=1.0)
knock(L2('rohan', 'Every second', -0.2), 0.012, px(1467), 240)
knock(L2('script', 'a script', -0.3), 0.010, px(770), 220)
tH = L2('byhand', 'ran it by hand', -0.1)
mark(tH, exact=False, g=0.8)
keys(L2('byhand', 'Before six', 0.0), 3, 0.005, px(770), 0.2)
paper(L2('byhand', 'emailed', -0.1), 0.009, px(1300), 0.35)
knock(L2('rule', 'inside it', 0.0), 0.012, px(1467), 240)
tap(L2('rule', 'approved by noon', -0.2), 0.007, px(1467)); tap(L2('rule', 'approved later', -0.2), 0.007, px(1467))
tap(L2('worked', 'It worked', -0.15), 0.008, px(570))
air(L2('worked', 'Its author', 0.4), 1.6, 0.005, px(600), 160, 800)
knock(L2('feb', 'claims app', -0.3), 0.010, px(250), 220)
tSt = L2('feb', 'stopped coming', -0.3)
knock(tSt + 0.1, 0.011, px(438), 170)
lead(E2, tSt, END('laptop', 'feb') + 1.1, 0.65, att=0.5, rel=1.0); part(G3, tSt + 0.3, END('laptop', 'feb') + 1.1, 0.38, att=0.5, rel=1.0)
for w_, x in (('One copy', 470), ('no history', 700), ('no test', 1070)):
    knock(L2('unsafe', w_, -0.15), 0.010, px(x + 60), 180)
tU = END('laptop', 'unsafe') + 0.3
lead(B2, tU, tU + 1.0, 0.55, att=0.3, rel=0.4); lead(E2, tU + 1.05, tU + 2.6, 0.55, att=0.3, rel=1.0)

# 3. Into the project: the laptop's script goes into Git: G major, the lead's G and the partner's D, as the window opens; the files and
#    the history, a tap a row. Its sums, a model in dbt: the window set down; the rule written once, on HR's calendar: the partner's
#    B. Ingrid confirms it: a person's approval, D to G; a change asks HR to review it: a tap. The tests, first: a tap for each edge;
#    they pass: G, both players, note for note. The three films: a card each. A branch: a breath of air as it draws; the pull
#    request laid down; its checks, a tap each
P3 = lambda lid, word, off=0: W('project', lid, word, off)
p0 = S0('project')
tPr = P3('move', 'data project', -0.3)
knock(tPr + 0.1, 0.012, px(960), 240)
lead(G2, tPr, tPr + 2.6, 0.6, att=0.5, rel=1.0); part(D4, tPr + 0.35, tPr + 2.6, 0.38, att=0.5, rel=1.0)
for w_ in ('beside the models', 'every change is kept'):
    tap(P3('git', w_, -0.2), 0.007, px(700))
for i in range(2):
    tap(P3('git', 'who made it', -0.4 + 0.4 * i), 0.007, px(800))
paper(G('project', 'model', -0.4), 0.010, px(960), 0.4)
part(B3, P3('model', 'written once', -0.2), P3('model', 'written once', 1.4), 0.36, att=0.3, rel=0.8)
knock(P3('model', 'calendar', -0.3), 0.011, px(960), 240)
approve(P3('ingrid', 'confirmed', -0.05), 0.62, hold=1.2)
tap(P3('ingrid', 'asks HR to review', -0.2), 0.008, px(1310))
paper(P3('tests', 'tests first', -0.4), 0.010, px(960), 0.35)
tap(P3('tests', 'eleven fifty-nine', -0.3), 0.007, px(760)); tap(P3('tests', 'twelve oh one', -0.3), 0.007, px(760))
tPs = P3('tests', 'two weeks later', 0.4)
tap(tPs, 0.008, px(1300))
lead(G3, tPs + 0.05, tPs + 1.5, 0.55, att=0.12, rel=0.9); part(G4, tPs + 0.05, tPs + 1.5, 0.36, att=0.12, rel=0.9)
for w_ in ('Declare it', 'Promises and proofs', 'Built in layers'):
    knock(P3('weeds', w_, -0.2), 0.010, px(960), 240)
air(P3('branch', 'a branch', -0.2), 1.4, 0.005, px(960), 160, 900)
paper(P3('branch', 'pull request', -0.2), 0.010, px(960), 0.35)
tap(P3('branch', 'build it', 0.0), 0.007, px(1300)); tap(P3('branch', 'every test', 0.0), 0.007, px(1360))

# 4. Someone else reads it: Jun's pull request rises (air); Sam's laid down. Sam reviews Jun's, Jun reviews Sam's: the second player
#    joins the first, the lead's D and the partner's G, then the partner's B. Merged once reviewed and green: the stamp, G major. Change
#    without surprises: its card. An agent proposes: its pull request laid down; a person approves: the approval, D to G
V4 = lambda lid, word, off=0: W('review', lid, word, off)
v0 = S0('review')
air(v0 + 1.3, 1.4, 0.005, px(960), 160, 900)
paper(V4('swap', 'Sam wrote the job', -0.3), 0.010, px(960), 0.35)
tR1 = V4('swap', 'so Sam reviewed', 0.3)
lead(D3, tR1, tR1 + 1.2, 0.5, att=0.2, rel=0.5)
part(G3, V4('swap', 'so Jun reviewed', 0.3), V4('swap', 'so Jun reviewed', 1.7), 0.4, att=0.2, rel=0.7)
tGr = V4('merge', 'every check green', -0.1)
stamp(tGr, 0.014, px(960))
lead(G2, tGr + 0.05, tGr + 2.0, 0.6, att=0.25, rel=1.0); part(B3, tGr + 0.2, tGr + 2.0, 0.36, att=0.25, rel=1.0)
knock(V4('surprises', 'Change without surprises', -0.3), 0.011, px(960), 240)
paper(V4('agents', 'an agent writes', -0.3), 0.010, px(960), 0.35)
approve(V4('agents', 'a person approves', 0.2), 0.6, hold=1.3)

# 5. The same way, every time: the bundle's file laid down, its lines a tap where they light; the Jobs window. The road: each stage
#    set down; the same files carried to test, a breath of air. Waiting for Noor: the lead's low D; she approves: the approval, D to G,
#    and the files carried on to production. The platform's own account: a key; nobody deploys from a laptop: a low knock. The same
#    files, the same steps, every time: the mark, both players, note for note. This morning's run: a tap a row; 856 paid today: G major
R5 = lambda lid, word, off=0: W('release', lid, word, off)
r0 = S0('release')
paper(R5('bundle', 'a file too', -0.3), 0.010, px(476), 0.4)
lead(D3, R5('bundle', 'Declarative', -0.2), R5('bundle', 'Declarative', 1.6), 0.5, att=0.4, rel=0.8)
tap(R5('bundle', "project's jobs", -0.2), 0.007, px(476)); tap(R5('bundle', 'where each one runs', -0.2), 0.007, px(476))
knock(R5('bundle', "project's jobs", -0.3), 0.011, px(1382), 240)
tap(R5('job', 'at six', -0.2), 0.007, px(1382)); tap(R5('job', 'builds and tests', -0.2), 0.007, px(1382))
tap(R5('job', 'everything it reads', -0.2), 0.007, px(1382))
knock(G('release', 'test', 0.0), 0.011, px(960), 240)
air(R5('test', 'deployed to test', -0.5), 1.3, 0.005, px(970), 160, 900)
lead(D3, R5('noor', 'waits for Noor', -0.2), R5('noor', 'When she approves', 0.2), 0.45, att=0.5, rel=0.4)
tAp = R5('noor', 'When she approves', 0.1)
stamp(tAp + 0.05, 0.014, px(1620))
approve(tAp + 0.1, 0.62, hold=1.4)
air(R5('noor', 'go to production', -0.4), 1.3, 0.005, px(1400), 160, 900)
knock(R5('account', "platform's own account", -0.2), 0.010, px(400), 300)
knock(R5('account', 'nobody deploys', -0.2), 0.010, px(400), 170)
mark(R5('drift', 'same files', -0.1), exact=True, g=0.8)
tTo = R5('today', 'This morning', 0.2)
paper(G('release', 'today', -0.2), 0.010, px(960), 0.4)
for i in range(3):
    tap(tTo + 0.15 * i + 0.1, 0.007, px(960))
t856 = R5('today', 'eight hundred', -0.1)
lead(G2, t856, END('release', 'today') + 1.4, 0.6, att=0.4, rel=1.2); lead(D3, t856 + 0.25, END('release', 'today') + 1.4, 0.4, att=0.4, rel=1.2)
part(B3, t856 + 0.5, END('release', 'today') + 1.4, 0.36, att=0.4, rel=1.2)

# 6. What to keep: none of this is new, as bridges took up the wind tunnel: the rows, a card each; C to G. Keep data work as software:
#    a card for each of the four. The next film: its card. Standards already exist: G, both players, as the mark appears. Investigate,
#    adapt, implement, iterate: the partner rising a step for each, G, A, B, D, and the docs, a card each
C6 = lambda lid, word, off=0: W('choose', lid, word, off)
c0 = S0('choose')
knock(C6('decades', 'software', -0.3), 0.011, px(505), 240)
knock(C6('decades', 'as bridges', -0.3), 0.011, px(505), 240)
tAs = C6('decades', 'as bridges', -0.2)
lead(C3, tAs, tAs + 1.2, 0.55, att=0.3, rel=0.4); lead(G2, tAs + 1.25, END('choose', 'decades') + 0.9, 0.55, att=0.3, rel=1.0)
part(E3, tAs + 0.15, tAs + 1.2, 0.34, att=0.3, rel=0.4); part(D4, tAs + 1.3, END('choose', 'decades') + 0.9, 0.34, att=0.3, rel=1.0)
for w_, x in (('in Git', 296), ('tested', 732), ('reviewed', 1168), ('deployed', 1604)):
    knock(C6('keep', w_, -0.2), 0.010, px(x), 240)
paper(C6('night', 'next film', -0.3), 0.010, px(960), 0.4)
tSd = C6('wheel', 'standards', -0.3)
lead(G2, tSd, tSd + 2.4, 0.55, att=0.6, rel=1.0); part(G3, tSd + 0.3, tSd + 2.4, 0.34, att=0.6, rel=1.0)
for i, (w_, m) in enumerate((('Investigate', G3), ('adapt', A3), ('implement', B3), ('iterate', D4))):
    tw = C6('docs', w_, -0.1)
    part(m, tw, tw + (0.55 if i < 3 else 1.5), 0.36, att=0.1, rel=0.35 if i < 3 else 0.9)
for w_, x in (('Investigate', 400), ('official docs', 960)):
    knock(C6('docs', w_, -0.4), 0.009, px(x), 260)

# 7. It still stands: the Narrows in 1950, G held, the partner's B. Payroll's export, tested: each pay day a tap as the strip lights;
#    just another Thursday. Data work is software: no music under it. The end card: the mark, both players, note for note, and G
#    ringing out
S7 = lambda lid, word, off=0: W('stands', lid, word, off)
s0 = S0('stands')
lead(G2, s0 + 0.4, S7('bridge', 'still stands', 1.2), 0.55, att=1.0, rel=1.2); part(B3, s0 + 1.0, S7('bridge', 'still stands', 1.2), 0.34, att=0.8, rel=1.2)
air(s0 + 0.6, 2.0, 0.004, px(700), 150, 800)
for i in range(3):
    tap(S7('export', 'tested before', -0.3) + 0.2 * i, 0.006, px(510 + 300 * i))
tap(S7('export', 'just another', -0.1), 0.007, px(1110))
tEnd = G('stands', 'breath', 0.3)
mark(tEnd, exact=True, g=0.85, last=2.6)
lead(G2, tEnd + 0.1, E('stands') - 0.2, 0.5, att=1.0, rel=1.6)
