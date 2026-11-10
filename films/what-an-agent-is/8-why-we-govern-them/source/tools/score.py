# Why we govern them: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 3 November 2026 against every score.py on main and on every branch, and against the series' other films
# (/mnt/project-files/agentic-data-engineering/series-1/palettes.md): an ondes Martenot quartet and a cornet. The ondes are Maurice
# Martenot's electronic instrument of 1928: four of them, one player to a note, held steady, with no vibrato and none of the slides the
# instrument is known for, each heard through its *palme* speaker, whose strings ring softly with the note it plays. The cornet is alone,
# played softly. Both are made here (music.py has neither).
#  - The film's figure is a ceiling. The cornet holds one note, the limit, the A above middle C, and one of the ondes climbs to it and
#    stops just under it, never above: built for 210 kilometres an hour; the speed allowed in the cab; "because they were fast"; the
#    four needs; the four rules. Where the limit is lowered (the cab's 210 to 160 in the opening, and "it can be lowered at any time" in
#    Limits it can't raise), the cornet steps down a tone, to G, and the figure follows it. At the close, as the team lets its agent do
#    more, the ondes reach the cornet's A together with it, and over the end card both step home to F.
#  - D major for Japan in 1964, F major for the university; the cornet's A belongs to both, so it's held across when the story moves to
#    the room. G major for the control room's board, D minor for the night the count fails, B flat at two chapters' turns.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break. The 1962 crash has no music: it stops before "in Tokyo" and comes back, one low
#    note alone, with the passengers.
#  - Nothing trembles, pulses or beats: each note is one voice held steady; the partials are harmonic; every chord is tuned pure (just
#    intonation from D, see hz()), so D major, G major, F major, B flat and D minor are all pure, and C is never held with G, nor E with
#    G or B (their intervals aren't pure here). No urgent pulse: the masts that whip past at seventeen seconds a kilometre get three quick
#    figures, once, not a beat.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve, lfilter
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
R1 = np.random.default_rng(1964)  # this film's own randomness: the rooms, the breath, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D major (D F# A),
# G major (G B D), F major (F A C), B flat (B flat D F) and D minor (D F A) are all pure in this table; C is never held with G (27/20
# here), nor E with G (32/27) or with B (40/27)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, three ondes to a chord, one to a note, lowest first; the fourth player is free for the figure
D_, G_, F_, Bb, Dm = (50, 57, 66), (43, 55, 62), (53, 60, 65), (46, 53, 62), (50, 57, 65)
LIMIT, LOWER = 69, 67  # the cornet's A, the limit, and the G a tone below, where it's lowered

# ---- the levels: the ondes about as far under the voice as the series' other music (matched by loudness, not by peak), the cornet a
# little above them; the effects about 12 dB under the music (FX scales them all)
# After the author's review of the series' opening films (4 November 2026), the music is 2 dB lower and the effects 2.5 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them); and F major, held 15
# times after the opening, twice within seconds of itself, is held 9 times: at three chapters' turns, as a chapter settles, and at the end.
# With the room set by what it rings where the notes are (below), the ondes are 2 dB higher and the cornet 2.4 dB, so each is as loud
# as before, its echo now quieter
OL, CL, FX = 0.0302, 0.0435, 2.4

# a room round the players: a small hall, ringing on for about a second and a half, and nothing much above 1.6 kHz. Its level is set
# by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level after
# it (_held), as the video guidelines ask: scaled by all it rang, as at first, the room rang 10 dB louder there than its share said,
# and moved the ondes' held notes by -6.4 to +5.0 dB and the cornet's by about +2 to +4.6, each by where its reflections met it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.6)).astype(np.float32))(np.arange(int(1.6 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.022 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(sig, amt):
    """a held note in the room, at its own level: the room's echoes meet a held note's own sound at its pitch, adding to it on one
    note and taking from it on another, so the note is set back to the level it had without the room, where it's held (within 3 dB
    of its own level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))

# ---- the ondes Martenot: an oscillator's near-sine note, a little hollow (a touch of its third and fifth partials), swelled in and out
# by the player's intensity key, held at one pitch: no vibrato, no slide. Its palme speaker: strings tuned to the scale ring
# sympathetically with the note, a soft metallic halo of its partials that grows while the note sounds and rings on a little after it
_OND = (1.0, 0.09, 0.2, 0.04, 0.08, 0.02, 0.035, 0.01, 0.015)
_PALME = (0.42, 0.34, 0.3, 0.22, 0.16, 0.11, 0.07)
def ond(m, a, b, g=1.0, att=0.35, rel=0.5, pan=0.0, palme=0.32, room=0.28):
    """one ondes, at one pitch from a to b: it swells in over att and fades over rel; its palme rings on for about a second"""
    f = hz(m); sec = max(0.12, b - a); tail = 1.3; n = int((sec + rel + tail) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.where(x < sec, np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2,
                 np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2 * (x < sec + rel))
    s = np.zeros(n)
    for k, ak in enumerate(_OND, 1):
        if f * k < 2400:
            s += ak * np.sin(2 * np.pi * f * k * x + 0.6 * k)
    s *= e
    # the palme: each string's ring follows the note's level, slowly (it takes a moment to speak, and rings on), higher ones shorter
    h = np.zeros(n)
    for k, bk in enumerate(_PALME, 1):
        if f * k >= 2400:
            break
        lam = np.exp(-1.0 / ((0.55 / (1 + 0.25 * (k - 1))) * SR))
        hk = lfilter([1 - lam], [1, -lam], e)
        h += bk * hk * np.sin(2 * np.pi * f * k * x + 1.3 * k + 0.4)
    s = s + palme * h / max(1e-9, float(np.abs(h).max())) * float(np.abs(s).max())
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2400)
    put(_held(s, room).astype(np.float32), a, g * OL, pan)

def hold(ch, a, b, g=1.0, att=1.2, rel=0.9, pans=(-0.25, 0.05, 0.22)):
    """a chord held by three ondes, one to a note, the lowest first and the others a moment apart"""
    for i, m in enumerate(ch):
        ond(m, a + 0.07 * i, b, g * (1.0 if i == 0 else 0.82), att=att, rel=rel, pan=pans[i % len(pans)])

def climb(s, notes, step=0.3, last=1.4, g=0.85, pan=-0.15):
    """the fourth ondes climbs, one note after another, each let go as the next speaks; the last is held, just under the limit"""
    for i, m in enumerate(notes):
        lastone = i == len(notes) - 1
        ond(m, s + step * i, s + step * i + (last if lastone else step * 0.92), g * (1.0 if lastone else 0.8),
            att=min(0.12, step * 0.4), rel=0.45 if lastone else 0.16, pan=pan, palme=0.36)

# ---- the cornet, alone, played softly: a brass note whose higher partials bloom a moment after the first, a soft tongue and a little
# breath as it starts, steady while held (no vibrato), with a short release; rounder than a trumpet, its brightness rolled off
def cor(m, a, b, g=1.0, att=0.09, rel=0.28, pan=0.12, room=0.3):
    """the cornet, from a to b"""
    f = hz(m); sec = max(0.2, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        ak = np.exp(-0.8 * (k - 1)) * (1 + 0.7 * np.exp(-((fk - 1100) / 420) ** 2))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.45 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / (rel / (1 + 0.2 * (k - 1))), 1)) ** 2, 1.0)
        s += ak * on * off * np.sin(2 * np.pi * fk * x + 0.5 * k)
    # a long note eases a little after its start, as a soft player settles, and swells back slightly before the end
    if sec > 1.5:
        s *= 0.9 + 0.1 * np.cos(np.pi * np.clip(x / sec, 0, 1)) ** 2
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(0.09)[:int(0.09 * SR)], 'band', (500, 1800)) * np.exp(-np.arange(int(0.09 * SR)) / SR / 0.025) * 0.035
    s[:len(br)] += br
    s = filt(s.astype(np.float32), 'low', 2300)
    put(_held(s, room).astype(np.float32), a, g * CL, pan)

def limit(a, b, g=1.0, m=LIMIT):
    """the cornet holds the limit; a note longer than about seven seconds takes a breath and goes on"""
    t = a
    while b - t > 7.5:
        cor(m, t, t + 6.6, g); t += 6.9
    cor(m, t, b, g)

# ---- soft sounds in the rooms, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a book, a rail's stop"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, a light click: a switch, a lock"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.01, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a card or a sheet laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def stamp(s, g=0.02, pan=0.0):
    """a person's mark pressed onto a card: a dull, soft press"""
    s_knock(s, g * FX, pan, 170); s_tap(s + 0.006, g * 0.45 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.9):
    """a signature: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.011, pan=0.0, sec=0.6):
    """a word struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0, lo=140, hi=900):
    """something passing: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def rush(s, sec, g=0.01):
    """the train beside us: a low, even rush of air for the length of the shot, swelling in and out"""
    s_air(s, sec, g * FX, 0.0, 90, 520)

# =============================================================================================================================
# 1. Built into the line: the opening, under the ondes. The morning platform: D major, three ondes swelling in. "Built for 210": the
#    cornet takes the limit, A, and the fourth ondes climbs D E F sharp G to it and stops. "Seventeen seconds": the train's rush, and
#    three quick figures as the masts whip past, once. The signals smear past the cab's window: a short, high note for each, gone before
#    it's read. "A missed signal could cost lives": the music stops; Tokyo, 1962, in silence. The passengers: one low D, alone. "Build
#    the limits into the line": the cornet's A comes back with the blue line, D major under it; in the cab the figure climbs as the
#    needle does, and stops under the limit; the allowed speed lowered, the cornet steps down to G. The control room: G major, the two
#    controllers watching the board. The driver answers: D major. The time cards set down; "no passenger has died": D major, the
#    cornet over it. The trains were fast: the figure once more at dusk. The university: F major under the same A, held across; the
#    cards circle, then slow, and the figure climbs as they settle; the arms reach the tools; the title on the series' mark, F with
#    the A over it
lw = lambda lid, word, off=0: W('line', lid, word, off)
lc = lambda lid, off=0: G('line', lid, off)
l0 = S0('line')
# the morning platform: D major, swelling in
hold(D_, l0 + 0.5, lc('speed', 0.2), 0.9, att=2.4, rel=1.1)
# built for 210: the limit, and the figure climbing to it
limit(lw('first', 'two hundred and ten', -0.1), lc('speed', 0.9), 0.85)
climb(lw('first', 'two hundred and ten', 0.5), (62, 64, 66, 67), 0.32, 1.5)
# seventeen seconds a kilometre: the rush beside the train, and three quick figures as the masts go by, once
rush(lc('speed', 0.1), G('line', 'signals') - lc('speed', 0.1) + 0.3, 0.012)
for i in range(3):
    climb(lw('speed', 'a kilometre', 0.55 * i), (62, 66, 69), 0.07, 0.35, 0.6 - 0.12 * i, pan=0.3 - 0.25 * i)
# the signals beside the track smear past the window: a short, high note each, gone before it's read; then the open fifth, low, under
# the arrow that runs on ahead
P_sig = lw('signals', 'the signals')
for u0 in (-0.4, 1.3):
    ond(81, P_sig + u0 + 0.25, P_sig + u0 + 0.45, 0.5, att=0.05, rel=0.12, pan=0.45 - 0.5 * (u0 > 0), palme=0.25)
hold((50, 57), lw('signals', 'and the train'), lc('missed', 0.2), 0.75, att=0.9, rel=1.4)
rush(lw('signals', 'and the train'), lc('missed') - lw('signals', 'and the train'), 0.010)
# Tokyo, 1962: nothing. The passengers: one low D, alone, until something had to change
ond(50, lc('rest', 0.5), END('line', 'change') + 0.4, 0.75, att=1.6, rel=1.4, pan=0.0)
# the limits built into the line: the cornet's A with the blue line, D major under it
P_lim = lw('build', 'the limits')
hold(D_, lc('build', 0.1), lc('cab', -0.2), 0.8, att=1.4, rel=0.9)
rush(lc('build', 0.0), lc('cab') - lc('build'), 0.010)
limit(P_lim + 0.3, lc('room', -0.2) - 2.2 + 0.3, 0.8)
# the cab: the speed allowed; the needle rises and the figure with it, stopping under the limit; lowered, the limit steps down to G
P_fast = lw('cab', 'goes faster')
tap(lw('cab', 'the speed allowed'), 0.01, px(1360))
climb(P_fast + 0.05, (62, 64, 66, 67), 0.22, 1.6, 0.8)
P_dn = lc('room') - 2.2
cor(LOWER, P_dn + 0.35, lc('room', 0.1), 0.75)
ond(62, P_dn + 0.6, lc('room', 0.1), 0.6, att=0.4, rel=0.5, pan=-0.2)
# one control room: G major as the board lights, the two controllers watching it (no handset is lifted any more, so no knock)
hold(G_, lc('room', 0.1), lc('driver', 0.1), 0.75, att=1.0, rel=0.9)
# the driver still drives, and answers for the train: D major
hold(D_, lc('driver', 0.15), lc('worked', 0.0), 0.75, att=1.0, rel=0.9)
# it worked: the train in daylight; the two time cards set down; and no passenger lost since: D major, the cornet over it
rush(lc('worked', 0.0), lc('bad') - lc('worked'), 0.010)
knock(lw('trip', 'six and a half', 0.1), 0.016, px(300)); knock(lw('trip', 'to four', 0.1), 0.018, px(630))
P_since = lw('safe', 'since that first day')
hold(D_, P_since - 0.2, lc('bad', 0.3), 0.85, att=1.4, rel=1.0)
limit(P_since + 0.4, lc('bad', 0.3), 0.75)
# the limits weren't there because the trains were bad: dusk; because they were fast: the figure climbs to the limit, once more
hold((50, 57), lc('bad', 0.2), lc('uni', 0.4), 0.7, att=1.2, rel=0.9)
limit(lc('fast', -0.3), lc('limits', 0.8), 0.8)
climb(lc('fast', 0.3), (62, 64, 66, 67), 0.34, 1.6, 0.75)
# the university: F major under the same A, held across; the cards circle, a breath of air, then slow; the blue line round the tray,
# and the figure climbs F G as they settle, stopping under the limit
hold(F_, lc('uni', 0.8), lc('limits', 0.6), 0.7, att=1.4, rel=0.9)
P_watch, P_round = lw('uni', 'no one can watch'), lw('limits', 'its limits')
air(P_watch - 0.4, P_round + 1.0 - P_watch, 0.008, px(1140))
limit(P_round, lc('breath', 2.6), 0.75)
climb(P_round + 0.9, (65, 67), 0.5, 1.8, 0.8)
# then we can let it do more: the arms reach two tools, a light touch each; F major into the title, and the mark drawn under the A
for i in (0, 1):
    tap(lc('more', 1.5 + 0.5 * i), 0.009, px(1730))
hold(F_, lc('more', 0.3), lc('breath', 3.2), 0.75, att=1.2, rel=1.4)

# 2. Capable, convincing, unaccountable: the count comes in as the title's F major fades, with no chord of its own at the turn (it
#    played the same chord again eight seconds later); the plain job's tick, one note. At night: D minor;
#    the check fails, a G left open; three light touches as the agent's arms reach its tools, and the draft laid in the tray. In the
#    morning, two marks pressed, the count matches again: F major, briefly. Could it do more: two rising notes, left open. The three
#    words' cards set down, one note for "a person answers". Yusuf's four questions pinned up; turned over, the four needs climb D F G
#    to the cornet's A, which comes in on "review"
tw = lambda lid, word, off=0: W('three', lid, word, off)
tc = lambda lid, off=0: G('three', lid, off)
t0 = S0('three')
paper(tw('count', 'census-day count'), 0.014, px(700))
paper(tc('plain', 0.1), 0.012, px(700))
ond(65, tc('plain', 0.6), tc('plain', 1.4), 0.6, att=0.1, rel=0.5, pan=-0.2)
# at night: D minor; the check fails: a G, left open
hold(Dm, tc('night', 0.2), tw('night', 'people approve', -0.3), 0.7, att=1.0, rel=1.0)
ond(67, tc('night', 0.55), tc('night', 1.6), 0.55, att=0.08, rel=0.4, pan=-0.3)
P_cause = tw('night', 'finds the cause')
for i in range(3):
    tap(P_cause + i * 0.7 + 0.5, 0.009, px(1730))
knock(tw('night', 'in test'), 0.014, px(1400), 200)
# in the morning: Jun's mark and Noor's, and the count matches again
P_appr = tw('night', 'people approve')
stamp(P_appr + 0.5, 0.018, px(1400)); stamp(P_appr + 1.2, 0.02, px(1400))
hold(F_, P_appr + 1.7, P_appr + 4.4, 0.7, att=0.6, rel=1.0)
# could it do more: two outlined cards, and two rising notes left open
ond(60, tw('more', 'work for all of them'), tw('more', 'work for all of them', 0.5), 0.5, att=0.08, rel=0.25, pan=0.3)
ond(65, tw('more', 'work for all of them', 0.5), tw('more', 'work for all of them', 1.5), 0.5, att=0.08, rel=0.5, pan=0.3)
ond(65, tw('more', 'change the pipeline'), tw('more', 'change the pipeline', 0.5), 0.5, att=0.08, rel=0.25, pan=0.35)
ond(67, tw('more', 'change the pipeline', 0.5), tw('more', 'change the pipeline', 1.6), 0.5, att=0.08, rel=0.6, pan=0.35)
# the three words, set down; "a person answers": one note
for lid in ('capable', 'convincing', 'unacc'):
    knock(tc(lid, 0.1), 0.014, px(500))
ond(57, tw('acts', 'a person answers'), tw('acts', 'a person answers', 1.4), 0.55, att=0.3, rel=0.7, pan=-0.1)
# Yusuf's four questions, pinned up one by one; turned over: D, F, G, and the cornet's A on "review"
knock(tw('yusuf', 'asks what'), 0.012, px(640), 180)
for lid in ('who', 'name', 'touch', 'checks'):
    knock(tc(lid, 0.15), 0.015, px(1500), 330)
P_four = [tc('four'), tw('four', 'an identity'), tw('four', 'limits'), tw('four', 'review')]
for i, m in enumerate((62, 65, 67)):
    ond(m, P_four[i] + 0.05, P_four[3] + 1.4 if i == 2 else P_four[i + 1] + 0.05, 0.7, att=0.1, rel=0.3 if i < 2 else 0.6, pan=-0.15)
limit(P_four[3], P_four[3] + 2.6, 0.75)

# 3. An owner: F major at the turn as its card lights. "As the driver answered for the train": the cab, D major, a moment. The tag
#    tied on; the "For" card and the log; the switch wired, a click as it lights. Handed over: the tag flies; "or it stops": a low F
#    let go as the band goes dark, and a soft F as it comes back. "Not just anyone may own one": a knock as the decision is set down
ow = lambda lid, word, off=0: W('owner', lid, word, off)
oc = lambda lid, off=0: G('owner', lid, off)
hold(F_, S0('owner') + 0.3, oc('must', 0.6), 0.7, att=0.9, rel=0.9)
P_drv = ow('must', 'as the driver')
hold(D_, P_drv, oc('jun', -0.2), 0.65, att=0.5, rel=0.7)
paper(ow('jun', 'so he owns it', -0.2), 0.012, px(940))
paper(ow('decides', "what it's for"), 0.014, px(700))
keys(ow('decides', 'reads what it did'), 4, 0.008, px(1630))
P_stop = ow('decides', 'can stop it')
tap(P_stop + 1.0, 0.012, px(880))
air(ow('moves', 'hands it over'), 1.1, 0.008, px(900))
P_stops = ow('moves', 'or it stops')
ond(53, P_stops - 0.1, P_stops + 0.35, 0.55, att=0.1, rel=0.3, pan=0.0)
ond(65, P_stops + 1.9, P_stops + 2.7, 0.5, att=0.3, rel=0.7, pan=0.1)
P_any = ow('hands', 'not just anyone')
knock(P_any, 0.014, px(940))

# 4. A name of its own: B flat at the turn. Its badge, "Jun Park", set on its hook; the log's lines typed. While it's learning: a light
#    touch on the glass: that's fine. Its work looks like his: a line typed; to stop it you'd have to stop Jun: a low D as
#    the wire runs to him. A name of its own: the badge turns, F then A. As the control room saw each train: G major, a moment. Stopped
#    without stopping anyone else: a click, and a click as it comes back
iw = lambda lid, word, off=0: W('identity', lid, word, off)
ic = lambda lid, off=0: G('identity', lid, off)
hold(Bb, S0('identity') + 0.3, ic('today', -0.3), 0.7, att=0.9, rel=0.9)
P_name = iw('today', "under Jun's name")
tap(P_name + 0.2, 0.011, px(1190))
keys(P_name + 0.3, 3, 0.008, px(700), step=0.35)
tap(ic('learning', 0.5), 0.01, px(1300))
tap(iw('looks', 'looks like his', 0.2), 0.009, px(700))
P_jun = iw('looks', 'stop Jun')
ond(50, P_jun - 0.2, P_jun + 2.0, 0.6, att=0.6, rel=0.6, pan=-0.2)
P_own = iw('own', 'a name of its own')
ond(65, P_own + 0.05, P_own + 0.45, 0.6, att=0.06, rel=0.2, pan=0.2); ond(69, P_own + 0.45, P_own + 1.6, 0.6, att=0.06, rel=0.6, pan=0.2)
hold(G_, iw('sees', 'as the control room'), iw('sees', 'the team sees', -0.3), 0.65, att=0.5, rel=0.7)
P_none = iw('sees', 'without stopping')
tap(P_none, 0.013, px(880)); tap(E('identity') - 2.2, 0.012, px(880))

# 5. Limits it can't raise: the cornet's chapter. Its turn: the limit, A, over F major. The role card set down. "Where its rails go":
#    the line, D major. The rails laid to the tools, a knock at each end; the arms touch them; the role's three lines; the blue line
#    round the tray. "Our choice": what it can do fills, and the figure climbs F G to the limit and stops. The mandate laid down; its
#    owner signs. The speed in the cab: the limit, A, as the box comes up; lowered, it steps down to G, and the figure follows, D F,
#    under it; the agent reaches to raise it and stops, and the lock clicks
mw = lambda lid, word, off=0: W('limits', lid, word, off)
mc = lambda lid, off=0: G('limits', lid, off)
hold(F_, S0('limits') + 0.3, mc('role', 0.9), 0.65, att=0.9, rel=0.9)
limit(S0('limits') + 0.7, mc('role', 0.9), 0.7)
knock(mw('role', "only its role's"), 0.014, px(700))
hold(D_, mc('rails', 0.1), mc('reach', -0.5), 0.7, att=0.8, rel=0.9)
rush(mc('rails', 0.0), mc('reach') - mc('rails'), 0.010)
for i in range(3):
    knock(mc('reach', 1.2 + 0.3 * i), 0.012, px(1600), 200)
P_reach = mw('reach', 'wherever its tools reach')
for i in range(3):
    tap(P_reach + i * 0.9 + 0.5, 0.009, px(1730))
for word in ('read-only', 'writing only drafts', 'no sensitive data'):
    tap(mw('fewest', word), 0.01, px(700))
air(mw('fewest', 'writing only drafts'), 1.2, 0.007, px(1400))
P_ours = mw('choice', 'our choice')
limit(P_ours - 0.2, mc('skill', 0.4), 0.7)
climb(P_ours + 0.3, (65, 67), 0.45, 1.8, 0.75)
paper(mc('mandate', 0.0), 0.016, px(700))
pencil(mw('mandate', 'its owner signs'), 0.012, px(760), 1.2)
# like the speed in the cab: set from outside, lowered at any time, never raised by the agent
P_low, P_raise = mw('cab', 'lowered'), mw('cab', 'never raise it')
hold(F_, mc('cab', 0.2), E('limits') - 2.8, 0.6, att=0.9, rel=1.0)
cor(LIMIT, mc('cab', 0.25), P_low + 0.2, 0.75)
cor(LOWER, P_low + 0.25, E('limits') - 2.8, 0.72)
climb(P_low + 0.7, (62, 65), 0.4, 1.0, 0.7)
climb(P_raise + 0.2, (62, 65), 0.4, 0.9, 0.6)
tap(P_raise + 0.5, 0.013, px(830))

# 6. A person checks: B flat at the turn. The change card laid down, its evidence fanned out, and a touch for each line read. The
#    approve box an agent never has: set down, struck through; "only for reference": one low note. No train turns its own signal green:
#    the cab, D major, and the limit as the box turns green. In test: two checks pass, F and A; its report laid down. Production: Jun's
#    mark and Noor's; the same for Jun's own change, two marks, and an F as it goes in
rw = lambda lid, word, off=0: W('review', lid, word, off)
rc = lambda lid, off=0: G('review', lid, off)
hold(Bb, S0('review') + 0.7, rc('checks', 0.3), 0.7, att=0.9, rel=0.9)
paper(rc('checks', 0.0), 0.014, px(700))
P_ev = rw('checks', 'checks its evidence')
paper(P_ev - 0.1, 0.012, px(580)); paper(P_ev + 0.3, 0.012, px(840))
for i in range(2):
    tap(P_ev + 0.9 + 0.8 * i, 0.008, px(580 + 260 * i))
tap(rw('never', 'its own work', -0.1), 0.011, px(1500))
strike(rw('never', 'no agent approves'), 0.011, px(1500), 0.7)
ond(58, rw('never', 'only for reference'), rw('never', 'only for reference', 1.4), 0.5, att=0.3, rel=0.7, pan=0.3)
hold(D_, rc('signal', 0.1), rc('test', -0.3), 0.65, att=0.6, rel=0.8)
limit(rc('signal', 0.9), rc('test', -0.3), 0.7)
air(rc('test', 0.2), 0.9, 0.007, px(1140))
P_alone = rw('test', 'agreed tasks alone')
ond(65, P_alone, P_alone + 0.5, 0.55, att=0.06, rel=0.4, pan=-0.05); ond(69, P_alone + 0.6, P_alone + 1.4, 0.55, att=0.06, rel=0.6, pan=0.1)
paper(rw('test', 'report what it did'), 0.014, px(700))
stamp(rw('prod', 'checked by its owner'), 0.018, px(470)); stamp(rw('prod', 'approved by a second person'), 0.02, px(470))
P_sec = rw('prod', 'approved by a second person')
air(rc('same', 0.0), 1.0, 0.007, px(240))
stamp(rc('same', 0.9), 0.018, px(470)); stamp(rc('same', 1.5), 0.02, px(470))
ond(65, rc('same', 1.7), rc('same', 3.0), 0.55, att=0.2, rel=0.6, pan=0.1)

# 7. Like any colleague: F major at the turn; three role cards set down; the same rules, the same security, two light touches. Four
#    rules: one note for each as it comes, D, F, G, climbing; the fourth, the mandate, brings the cornet's A, and the figure rests under
#    it. The three books slid onto the shelf; series 3 and 4, two notes, and F major to the end
qw = lambda lid, word, off=0: W('rules', lid, word, off)
qc = lambda lid, off=0: G('rules', lid, off)
hold(F_, S0('rules') + 0.6, qc('most', 3.6), 0.65, att=1.0, rel=0.9)
for i in range(3):
    knock(qw('most', 'a role', 0.3 * i), 0.013, px(325 + 635 * i))
tap(qw('most', 'the same rules'), 0.009, px(810)); tap(qw('most', 'the same security'), 0.009, px(1110))
R4 = [qc('rights'), qc('owner'), qc('approve'), qc('mandate')]
for i, m in enumerate((62, 65, 67)):
    ond(m, R4[i] + 0.05, R4[i] + 2.2, 0.62, att=0.1, rel=0.6, pan=-0.15 + 0.1 * i)
ond(67, R4[3] + 0.1, R4[3] + 3.0, 0.55, att=0.3, rel=0.8, pan=0.05)
limit(R4[3] + 0.1, R4[3] + 3.0, 0.72)
for t_ in (qc('feng'), qc('iso'), qw('iso', "NIST's")):
    knock(t_ + 0.5, 0.015, px(700), 210)
P_ser = qc('series')
ond(65, P_ser + 0.05, P_ser + 0.6, 0.55, att=0.06, rel=0.4, pan=0.2); ond(69, P_ser + 0.35, P_ser + 1.4, 0.55, att=0.06, rel=0.6, pan=0.3)
hold(F_, P_ser + 0.8, E('rules') - 1.6, 0.6, att=0.8, rel=1.0)

# 8. Because they are capable: today's train, D major, and the cornet's A as "allowed 285" comes up; the 1964 platform and "because they
#    are fast": the figure climbs to it, as at dusk in the opening. The room: F major under the same A, held across. An owner, a name,
#    limits and review: each need swells, D F G and the A. Let it do more: the ghost cards fill, and the ondes climb F G A and reach the
#    limit with the cornet, together, the only time they do. The count leaves for the government on a breath of air; the next cards
#    set down. The end card: F major, and the cornet and the ondes step home together, A to F
cw = lambda lid, word, off=0: W('capable', lid, word, off)
cc = lambda lid, off=0: G('capable', lid, off)
c0 = S0('capable')
rush(c0 + 0.2, cc('notbad') - c0, 0.010)
P_285 = cw('sixty', 'two hundred and eighty-five')
hold(D_, P_285 - 0.4, P_285 + 2.2, 0.7, att=1.0, rel=1.0)
limit(P_285 + 0.1, P_285 + 2.2, 0.75)
hold((50, 57), cc('fast', 0.0), cc('fast', 2.4), 0.65, att=0.8, rel=0.9)
limit(cc('fast', 0.3), cc('fast', 2.4), 0.72)
climb(cc('fast', 0.2), (62, 64, 66, 67), 0.3, 1.4, 0.7)
hold(F_, cc('govern', 0.6), cc('govern', 2.8), 0.62, att=1.0, rel=1.0)
named = [cw('more', 'an owner'), cw('more', 'a name'), cw('more', 'limits'), cw('more', 'review')]
for i, m in enumerate((62, 65, 67)):
    ond(m, named[i], named[i] + 0.5, 0.5, att=0.06, rel=0.35, pan=-0.1)
P_dm = cw('more', 'do more')
limit(named[3], P_dm + 2.4, 0.72)
hold(F_, named[3] + 0.2, P_dm + 2.4, 0.6, att=0.8, rel=1.0)
climb(P_dm + 0.2, (65, 67, 69), 0.42, 1.6, 0.85)
air(cw('trust', 'the number', 0.2), 1.6, 0.008, px(1640))
knock(cc('next', 0.1), 0.014, px(700)); knock(cc('series2', 0.1), 0.014, px(700))
# the end card: F major; the cornet and the ondes on A together, then home to F
P_end = cc('breath')
hold(F_, P_end + 0.2, E('capable') - 0.6, 0.7, att=1.4, rel=1.6)
cor(LIMIT, P_end + 0.5, P_end + 2.4, 0.7); ond(69, P_end + 0.5, P_end + 2.4, 0.55, att=0.4, rel=0.3, pan=-0.15)
cor(65, P_end + 2.5, E('capable') - 0.8, 0.7); ond(65, P_end + 2.5, E('capable') - 0.8, 0.55, att=0.3, rel=1.2, pan=-0.15)
