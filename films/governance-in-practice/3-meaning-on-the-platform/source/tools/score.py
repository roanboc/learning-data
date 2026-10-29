# Meaning on the platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for the series (checked against the prologue, Governance principles and Governance on the map, and against this
# series' other films, so none repeats): a consort of viols, a treble, a tenor and a bass, one player to a note, and a mandolin, one
# string to a note, plucked without tremolo; both made here (music.py has neither), played softly, so nothing rings above the voice.
#  - The consort holds the chords: under the opening, as Mei's Monday goes from her new words to the five glossaries and the two
#    reports, and on to the page, the setting and the one count that came instead; after it, only at a chapter's turn, under a
#    moment on screen or in a pause without words.
#  - The mandolin marks what lands, close and soft, and its marks mean the same all through: two notes rising a third when a copy
#    comes into step with its home, a single low note when a copy has drifted, and a falling fourth when an owner approves.
#  - The opening's problem is in the consort: Mei's line falls as she says she never sees her words used, and is left unresolved;
#    as the five glossaries' three meanings light, each player comes in on a note of its own; the two reports' numbers on two
#    players, and under the question nobody could answer the bass is left alone, on the fifth. "Something had to change" stops
#    it, and the solution comes in on the home chord.
#  - The series' mark, four notes, 1-5-4-8, on the bass viol with the mandolin above, under the title and the end card.
#  - D major all through.
# The rules the series keeps:
#  - Music only from time to time (the series, 20 October 2026): under the opening story, and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks that after the
#    opening no chapter has music for more than half its length, or for 12 seconds without a break.
#  - Nothing trembles, pulses or beats: each viol is one voice, with no vibrato, and the mandolin's strings are single, not pairs;
#    every chord is tuned pure (just intonation, see hz()), and the chords on the second degree are left out (their fifth isn't
#    pure here). Nothing pulses, even when a copy has drifted.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in
#    src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz: keys at night, paper, a page turned, a pencil, a highlighter, a pin, a
# stamp, an envelope sealed.

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
R1 = np.random.default_rng(16)  # this film's own randomness: the room, the bow's air, the paper, the keys

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. The chords used
# are I, IV, V, vi and iii, whose fifths are all pure in this table; E is never held with B or G (a wolf fifth and a Pythagorean
# third, both here)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.8324)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the chords, as (bass viol, tenor viol, treble viol): one player to a note, the bass at the root
I, IV, V, vi, iii = (38, 57, 66), (43, 59, 62), (45, 61, 64), (47, 62, 66), (42, 57, 61)

# ---- the levels: the consort sits about as far under the voice as the series' other films' music (matched by loudness, not by
# peak); the mandolin a little under it, as it's plucked close; the effects about 12 dB under the music (FX scales them all)
VL, ML_, FX = 0.03, 0.05, 1.6
LEVEL = {'tr': 1.0, 'te': 1.0, 'ba': 1.1}
PAN = {'tr': -0.3, 'te': 0.0, 'ba': 0.3}  # as a consort sits in a half circle: the treble at the left, the bass at the right

# ---- the viols. A viol is bowed underhand, lightly, and its thin, flat-backed body gives every harmonic of a note a reedy, nasal
# colour (a band near 1.2 kHz on the treble, lower on the others), with less weight low down than a violin's. Each long note swells
# a little and eases, as a viol player shapes it with the bow, and the frets let it ring a moment after the bow leaves the string.
# A little of the bow's air, more as it starts; the pitch holds, with no vibrato; the bow's weight drifts by a percent or two,
# slowly, as a player's does. A small panelled room round the players rings on for about a second and a half
BODY = {  # resonances as (Hz, width, weight); where the harmonics start to fall away; the bow's air band
    'tr': ([(290, 100, 0.55), (510, 150, 0.85), (1200, 500, 0.8)], 1500, (700, 2000)),
    'te': ([(200, 70, 0.55), (380, 120, 0.85), (980, 420, 0.75)], 1250, (500, 1600)),
    'ba': ([(100, 36, 0.55), (230, 80, 0.9), (720, 320, 0.7)], 950, (280, 1200))}
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
def _harm(inst, f):
    """the weights of a note's harmonics on inst, at f Hz"""
    F, fm = BODY[inst][:2]; n = max(1, int(2500 // f)); k = np.arange(1, n + 1); fk = f * k
    r = sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in F) + 0.1
    a = r / k ** 0.85 / (1 + (fk / fm) ** 2) * np.clip((2500 - fk) / 250, 0, 1)
    return a / np.sqrt((a ** 2).sum())
def line(inst, segs, g=1.0, att=0.3, rel=0.6, room=0.3, pan=None, tie=False):
    """one player's line: segs is [(start, end, note, level)], each note slurred into the next, and the same note again re-bowed
    unless tie; a rest (note None) breaks it"""
    run = []
    for s in list(segs) + [(None, None, None, 0)]:
        if s[2] is None:
            if run:
                _line(inst, run, g, att, rel, room, PAN[inst] if pan is None else pan, tie)
            run = []
        else:
            run.append(s)
def _line(inst, segs, g, att, rel, room, pan, tie):
    T0, T1 = segs[0][0], segs[-1][1]; xf = 0.04
    n = int((T1 - T0 + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    e = e * np.where(x > T1 - T0, np.cos(0.5 * np.pi * np.minimum((x - (T1 - T0)) / rel, 1)) ** 2, 1.0)
    for i in range(1, len(segs)):  # the same note again is a new bow: it dips for a moment
        if segs[i][2] == segs[i - 1][2] and not tie:
            e = e * (1 - 0.75 * np.exp(-((x - (segs[i][0] - T0)) / 0.05) ** 2))
    fq = R1.uniform(0.11, 0.37, 3); fp = R1.uniform(0, 2 * np.pi, 3)
    bow = 1 + 0.015 * sum(np.sin(2 * np.pi * a * x + b) for a, b in zip(fq, fp)) / 3  # the bow's weight, drifting slowly
    s = np.zeros(n)
    for i, (a, b, m, v) in enumerate(segs):  # a slur is a finger on the next fret: the note stops as the next begins, in 40 ms, with no slide
        p0 = 0 if i == 0 else max(0, int((a - T0 - xf / 2) * SR)); p1 = n if i == len(segs) - 1 else min(n, int((b - T0 + xf / 2) * SR))
        xs, f = x[p0:p1], hz(m); w = np.full(p1 - p0, float(v))
        if i:
            w *= np.sin(0.5 * np.pi * np.clip((xs - (a - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if i < len(segs) - 1:
            w *= np.cos(0.5 * np.pi * np.clip((xs - (b - T0 - xf / 2)) / xf, 0, 1)) ** 2
        if b - a >= 0.95:  # a long note swells a little and eases, once: the bow's shape, not a pulse
            w *= 0.86 + 0.14 * np.sin(np.pi * np.clip((xs - (a - T0)) / (b - a), 0, 1))
        else:
            w *= 0.86
        es = e[p0:p1]
        for j, aj in enumerate(_harm(inst, f)):  # the higher harmonics come in a little after the lower, and leave first as the frets ring on
            if aj > 1e-4:
                s[p0:p1] += aj * w * es ** (1 + 0.15 * j) * np.sin(2 * np.pi * f * (j + 1) * xs + 0.9 * j * j)
    s = s * bow; lev = e * bow * 0.9
    lo, hi = BODY[inst][2]
    s = s + 0.014 * filt(noise(n / SR + 0.01)[:n], 'band', (lo, hi)) * lev * (1 + 2.5 * np.exp(-x / 0.07))
    s = filt(s.astype(np.float32), 'low', 2400)
    if room:
        s = np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
    put(s.astype(np.float32), T0, g * VL * LEVEL[inst], pan)
def note(inst, m, s, sec, g=1.0, **o):
    """one held note"""
    line(inst, [(s, s + sec, m, 1.0)], g, **o)
def chord(c, a, b, g=0.6, step=0.15, att=0.5, rel=0.8):
    """a held chord, each player coming in a moment after the one under it: c is (bass, tenor, treble), or {player: note}, lowest
    first"""
    for i, (inst, m) in enumerate((c if isinstance(c, dict) else dict(zip(('ba', 'te', 'tr'), c))).items()):
        line(inst, [(a + step * i, b, m, 1.0)], g, att=att, rel=rel)

# ---- the mandolin, one string to a note (its strings come in pairs, and a pair a little apart in tune would beat): steel, plucked
# once with a soft plectrum near the bridge, so the note starts bright and its upper harmonics die first; the bowl-backed body's
# resonances near 300, 600 and 1100 Hz; no tremolo, and nothing above about 2.4 kHz. It sits close, a little right of the consort
MB = [(300, 120, 0.8), (600, 200, 1.0), (1100, 400, 0.6)]
def mand(m, s, g=1.0, pan=0.18):
    f = hz(m); d = 0.9 * (294 / f) ** 0.5; sec = 3.5 * d + 0.1; x = tt(sec); sig = np.zeros(len(x))
    for k in range(1, int(2400 // f) + 1):
        fk = f * k; a = abs(np.sin(np.pi * k * 0.14)) / k ** 0.7 * (sum(w / np.sqrt(1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in MB) + 0.25)
        sig = sig + a * np.sin(2 * np.pi * fk * x + 0.7 * k * k) * np.exp(-x / (d / (1 + 0.7 * (k - 1))))
    sig = sig * np.minimum(1, x / 0.0015) + 0.08 * filt(noise(sec)[:len(x)], 'band', (500, 1800)) * np.exp(-x / 0.005)
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = np.pad(sig, (0, len(_IR) - 1)) + 0.15 * fftconvolve(sig, _IR).astype(np.float32)
    put(sig.astype(np.float32), s, g * ML_, pan)
def instep(s, g=0.85):
    """a copy comes into step with its home: two notes rising a third"""
    mand(74, s, g); mand(78, s + 0.2, g * 0.9)
def drift(s, g=0.9):
    """a copy has drifted: a single low note"""
    mand(57, s, g)
def approve(s, g=0.8):
    """an owner approves: a falling fourth"""
    mand(67, s, g); mand(62, s + 0.3, g * 0.9)
def mark(s, g=0.75, step=0.42):
    """the series' mark, 1-5-4-8: the bass viol, and the mandolin an octave above"""
    for i, m in enumerate([50, 57, 55, 62]):
        last = i == 3
        note('ba', m, s + step * i, 1.8 if last else step, g, att=0.06, rel=0.8 if last else 0.12, pan=0.1)
        mand(m + 12, s + step * i, g * (0.75 if last else 0.65))

# ---- soft sounds on the desks and boards, all low-passed
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a book set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.012, pan=0.0, step=0.13):
    """a few keys typed, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.02, pan=0.0, sec=0.45):
    """a sheet of paper laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pin(s, g=0.022, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, g=0.012, pan=0.0, sec=0.6):
    """a pencil line on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6, s, g * FX, pan)
def strike(s, g=0.012, pan=0.0, sec=0.6):
    """a line struck through: a pencil drawn quickly, firmer as it starts"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def marker(s, g=0.012, pan=0.0, sec=0.6):
    """a highlighter drawn along a line: a soft felt tip, an even hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (350, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def page(s, g=0.016, pan=0.0):
    """a page turned: a breath of air as it lifts, and a padded flap as it lies"""
    s_air(s, 0.35, g * 0.5 * FX, pan, 150, 900); paper(s + 0.25, g * 0.7, pan, 0.25)
def slide(s, g=0.016, pan=0.0, sec=0.8):
    """something slid across a desk: a low, rough slide"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)
def stamp(s, g=0.02, pan=0.0):
    """a rubber stamp pressed on a sheet: a padded thud"""
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25) + 0.4 * filt(noise(0.25), 'band', (150, 800))[:len(x)] * np.exp(-x * 35)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def seal(s, g=0.016, pan=0.0):
    """an envelope sealed: its flap folded down, and pressed shut"""
    paper(s, g * 0.8, pan, 0.3); x = tt(0.2)
    X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 30)).astype(np.float32) + 0.3 * filt(noise(0.2), 'band', (200, 900))[:len(x)] * np.exp(-x * 40), 'low', 800)), s + 0.28, g * 0.8 * FX, pan)
def air(s, sec=0.8, g=0.012, pan=0.0):
    """something moving across the frame: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)

# =============================================================================================================================
# 1. Words that reach the work: the opening, under the consort all through. Monday, the home chord, the treble rising as Mei is
#    named the owner of award's page; the meaning changes, struck through and typed in, on the fourth, the treble rising with the
#    new meaning, and home as it's published; until now, in her memory, the sixth, and her line falling, left unresolved; the five
#    glossaries pinned, and as their three meanings light, each player on a note of its own; the two reports set down, their numbers
#    on the tenor and the treble; the envelope, the pencilled question, and the bass alone on the fifth; "Something had to change"
#    stops it. Then the solution, on the home chord: award's page pinned, a thread to the data team's copy and its tick, in step;
#    the setting, on the fourth; the count once, home again; that night, the sixth, and the check finds Monday's change, keys typed
#    by nobody and the mandolin's low note; Tuesday morning, home, and a thread to each place her words touch; submission day, the
#    fifth, then both reports ticked, in step, and home; the envelope sealed and sent; her words reach the work, the treble rising
#    to the home note; and the title on the mark
ww = lambda lid, word, off=0: W('words', lid, word, off)
wc = lambda lid, off=0: G('words', lid, off)
own, ch, chW, mc, cnt, six = ww('owns', 'owns'), wc('changes', -0.3), ww('changes', 'changes'), ww('changes', 'microcredentials'), ww('changes', 'count too'), ww('changes', 'six credit points')
sl, said, never = wc('slowed', -0.3), ww('slowed', 'Mei said'), ww('slowed', 'then never')
five, fiveW, three = wc('five', -0.4), ww('five', 'five glossaries'), ww('five', 'three meanings')
two, cen, n1, dr, gov, n2, q = wc('two', -0.3), ww('two', "Planning's census report"), ww('two', 'eight hundred and twelve'), ww('two', 'the draft submission'), ww('two', 'to the government'), ww('two', 'government', 0.5), ww('explain', "couldn't explain")
chg, now, pg, every, night = wc('change'), wc('page', -0.3), ww('page', 'one page'), ww('page', 'every copy'), ww('page', 'each night')
set_, once, rep, ag = ww('setting', 'six credit points'), ww('once', 'counted once'), ww('once', 'every report'), ww('once', 'every agent')
nt, finds, tue, sees, touch = wc('night', -0.3), ww('night', 'the check finds'), ww('night', 'on Tuesday morning', -0.3), ww('night', 'Mei sees'), ww('night', 'everything her words touch')
day, both, num, reach, rw = wc('day', -0.3), ww('day', 'both reports'), ww('day', 'four thousand'), wc('reach', -0.3), ww('reach', 'reach the work')
board, title = wc('breath', -0.3), wc('breath', 1.2)
# Monday: the home chord, D, the players coming in one by one; the treble rises as her name lights on the page, its owner
chord({'ba': 38, 'te': 57}, 0.3, ch + 0.1, 0.75, step=0.35, att=0.8)
line('tr', [(1.0, own, 66, 1.0), (own, ch + 0.1, 69, 1.0)], 0.7, att=0.6)
marker(own + 0.1, 0.008, px(1420), 0.5)
# the meaning changes: the words before Monday struck through, Monday's typed in under them, microcredentials and the 6 credit points
# lit, and published; the fourth, the treble rising with the new meaning, and home as it's published
strike(chW + 0.1, 0.010, px(960), 1.0)
keys(chW + 0.3, 14, 0.008, px(960), 0.17)
marker(mc, 0.008, px(800), 0.5); marker(six, 0.008, px(1100), 0.5)
tap(cnt, 0.010, px(1500))
chord({'ba': 43, 'te': 59}, ch + 0.1, cnt + 0.2, 0.7, step=0.15, att=0.5)
line('tr', [(ch + 0.1, mc, 62, 1.0), (mc, cnt + 0.2, 67, 1.0)], 0.65, att=0.4)
chord(I, cnt + 0.2, sl + 0.1, 0.65, step=0.1, att=0.4)
# until now, in her memory: the sixth, softer; as she says what slowed her down, the treble falls, and is left on the ninth
chord({'ba': 47, 'te': 54}, sl + 0.1, five + 0.2, 0.55, step=0.2, att=0.8)
line('tr', [(sl + 0.3, said, 66, 0.9), (said, never, 62, 1.0), (never, five + 0.2, 61, 0.9)], 0.55, att=0.6)
# the five glossaries, each pinned to Yusuf's board; as their three meanings light, each player comes in on a note of its own, the
# treble for the violet, the tenor for the rose, the bass for the olive: the third's chord, not home
for i in range(5):
    pin(fiveW + 0.18 * i + 0.1, 0.016, px(360 + 300 * i))
for k, (inst, m) in enumerate((('tr', 61), ('te', 57), ('ba', 42))):
    note(inst, m, three + 0.2 * k, two - 0.3 - three - 0.2 * k, 0.6, att=0.3)
# two reports, two ways: each set down, the census report's number on the tenor and the draft's on the treble, over the fourth; the
# envelope for the government between them, and the pencilled question: the others stop, and the bass is left alone on the fifth
paper(cen - 0.2, 0.016, px(450), 0.4); paper(dr - 0.2, 0.016, px(1470), 0.4)
note('ba', 43, two + 0.1, q - 0.3 - two - 0.1, 0.6, att=0.6)
note('te', 59, n1, q - n1, 0.6, att=0.3)
note('tr', 62, n2, q - n2, 0.6, att=0.3)
slide(gov, 0.012, px(960), 0.6)
pencil(q, 0.012, px(1100), 0.5)
note('ba', 45, q, chg + 0.6 - q, 0.55, att=0.4, rel=0.9)
# something had to change: it stops, and the picture steps back in the quiet. Now: the home chord comes in, one player at a time;
# award's page pinned to the board; a thread to the data team's copy, its tick each night, in step, and a thread on to the catalog
chord(I, now + 0.1, set_ - 0.1, 0.65, step=0.25, att=0.7)
pin(pg - 0.1, 0.018, px(520))
pencil(every - 0.1, 0.009, px(820), 0.9)
instep(night + 0.1); pencil(night + 0.6, 0.009, px(1350), 0.9)
# the setting, on the fourth, its dial pinned up; the count once, home again: a ledger set down, a thread to each report and the
# assistant
chord(IV, set_ - 0.1, once - 0.1, 0.6, step=0.1, att=0.4)
pin(set_ + 0.1, 0.016, px(450))
chord(I, once - 0.1, nt + 0.1, 0.6, step=0.1, att=0.4)
knock(once + 0.1, 0.016, px(960), 200); paper(once + 0.15, 0.012, px(960), 0.35)
for t in (rep, rep + 0.5, ag):
    pencil(t, 0.007, px(1300), 0.5)
# that night: the sixth, low and soft, in the dark room; the check finds Monday's change, a pull request opening by itself, keys
# typed by nobody, and the mandolin's low note: a copy has drifted
chord(vi, nt + 0.1, tue + 0.2, 0.5, step=0.25, att=0.8)
keys(finds + 0.2, 5, 0.006, px(1780), 0.14); drift(finds + 0.2)
# Tuesday morning: home, and as Mei sees what her words touch, the treble rises; a thread to each
chord({'ba': 38, 'te': 57}, tue + 0.2, day + 0.1, 0.6, step=0.15, att=0.6)
line('tr', [(tue + 0.4, sees, 66, 1.0), (sees, day + 0.1, 69, 1.0)], 0.6, att=0.5)
for i in range(4):
    pencil(touch + 0.25 * i, 0.007, px([1250, 1560, 1250, 1540][i]), 0.5)
# submission day: the fifth, waiting, as the census report takes the glossary's words and both numbers come in; both ticked, in
# step, and home; the envelope sealed with one number, and into the out-tray
chord(V, day + 0.1, num + 0.8, 0.6, step=0.12, att=0.5)
page(both, 0.014, px(450))
instep(num + 0.8); pencil(num + 0.8, 0.008, px(450), 0.3); pencil(num + 0.95, 0.008, px(1470), 0.3)
chord({'ba': 38, 'te': 57}, num + 0.8, board + 0.4, 0.6, step=0.08, att=0.4)
seal(num + 1.6, 0.016, px(960))
slide(reach - 1.0, 0.012, px(960), 0.6)
# her words reach the work: the treble rises to the home note, and her line, as it reads now, is ticked
line('tr', [(num + 0.85, rw, 66, 1.0), (rw, rw + 1.0, 69, 1.0), (rw + 1.0, board + 0.4, 74, 0.9)], 0.6, att=0.4)
pencil(rw + 0.3, 0.010, px(1100), 0.35)
# the board: the third card lights and lifts, and becomes the title, on the mark over the home chord
knock(board + 0.35, 0.014, px(1415), 280); air(board + 1.0, 0.9, 0.008, px(1415))
chord({'te': 57, 'tr': 66}, board + 0.4, E('words') + 0.3, 0.55, step=0.2, att=0.8, rel=1.0)
mark(title + 0.3)

# 2. One term, one page: a chord at the turn; the page's badge, its words, owner and domain lit, the tables that hold it and where its
#    words come from; Noor's map, the term published one way, and a pencil reaching for the page, stopped; Clara at her screen; the
#    assistant's question typed and its answer, citing the page: in step, on the home chord
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
p0 = S0('page')
chord(IV, p0 + 0.2, p0 + 2.6, 0.55, step=0.2, att=0.6, rel=0.8)
tap(pw('term', 'in beta'), 0.008, px(1500))
for t in (pw('has', 'its words'), pw('has', 'its owner'), pw('has', 'its domain')):
    marker(t, 0.007, px(900), 0.45)
for i in range(3):
    tap(pw('lists', 'the tables') + 0.25 * i, 0.007, px(1100))
marker(pw('lists', 'where its words come from'), 0.007, px(900), 0.5)
mp, pub, made, nev = pc('map', -0.3), pw('map', 'published'), pw('map', 'a change is made'), pw('map', 'never on the page')
paper(mp + 0.1, 0.014, px(960), 0.4)
air(pub, 1.0, 0.007, px(1200))
pencil(made - 0.2, 0.009, px(1300), 0.9); knock(nev + 0.1, 0.010, px(1400), 300)
tap(pc('read', -0.1), 0.008, px(910))
ci, ans = pc('cites', -0.3), pw('cites', 'it cites')
keys(ci + 0.1, 6, 0.008, px(960), 0.15)
knock(ans - 0.4, 0.010, px(960), 260)
instep(ans + 0.1, 0.7)
chord(I, ans + 0.2, E('page') + 0.3, 0.5, step=0.2, att=0.8, rel=0.8)

# 3. A copy that says where it came from: a chord at the turn; the copy's sheet and the model's, their words lit; the copy's source,
#    its term and the day it was synced; each build's arrow to the catalog, the comment typed from the project's words, in step, and
#    the way back crossed
cw = lambda lid, word, off=0: W('copy', lid, word, off)
cc = lambda lid, off=0: G('copy', lid, off)
c0 = S0('copy')
chord(I, c0 + 0.2, c0 + 2.6, 0.55, step=0.2, att=0.6, rel=0.8)
paper(c0 + 0.25, 0.014, px(960), 0.45)
marker(cw('keeps', 'its own copy'), 0.007, px(900), 0.5)
paper(cw('keeps', 'the tables that hold award') - 0.25, 0.012, px(960), 0.4)
marker(cw('keeps', 'in the same words'), 0.007, px(900), 0.5)
src = cw('names', 'names its source')
for t in (src, src + 0.3, cw('names', "the glossary's term"), cw('names', 'the day it was synced')):
    marker(t, 0.006, px(900), 0.35)
bld, desc, back = cw('sends', 'Each build'), cw('sends', 'sends the descriptions'), cw('sends', 'never back')
air(bld, 0.9, 0.007, px(1100))
keys(desc, 7, 0.008, px(600), 0.14)
instep(desc + 1.0, 0.7)
chord(IV, desc + 0.9, back + 1.4, 0.5, step=0.2, att=0.6, rel=0.8)
strike(back, 0.009, px(1300), 0.6)

# 4. The nightly sync: the sixth at the turn, the room empty; the check reading line by line, keys typed by nobody, and Monday's change
#    found: the mandolin's low note; the pull request it opened, the old words struck and the new typed; what they touch, a box each;
#    Tuesday morning on the home chord, Mei's approval with the falling fourth, and data governance's; a thread to each place her
#    words are used
sw_ = lambda lid, word, off=0: W('sync', lid, word, off)
sc_ = lambda lid, off=0: G('sync', lid, off)
s0 = S0('sync')
chord(vi, s0 + 0.2, s0 + 2.8, 0.5, step=0.25, att=0.8, rel=0.9)
cmp_, chd = sw_('every', 'each copy', -0.3), sw_('monday', 'had changed')
keys(cmp_ + 0.3, 8, 0.005, px(960), 0.3)
drift(chd + 0.1)
op, on, wt = sc_('opened', -0.3), sw_('opened', 'the old words'), sw_('opened', 'what the new words touch')
tap(op + 0.15, 0.008, 0.0)
strike(on, 0.009, px(700), 0.7); keys(on + 0.5, 6, 0.007, px(1100), 0.15)
marker(wt, 0.007, px(960), 0.5)
for k, w_ in enumerate(('Three tables', 'eight definitions', 'the code', 'three reports')):
    paper(sw_('three', w_), 0.010, px([550, 1370, 550, 1370][k]), 0.3)
tu, ap, cf = sc_('tuesday', -0.3), sw_('tuesday', 'Mei approved'), sw_('tuesday', 'data governance confirmed')
chord(I, tu + 0.1, cf + 1.2, 0.5, step=0.2, att=0.6, rel=0.8)
stamp(ap + 0.15, 0.018, px(1500)); approve(ap + 0.15)
stamp(cf + 0.15, 0.014, px(1500))
used = sw_('saw', 'where her words are used')
for i in range(4):
    pencil(used - 0.4 + 0.25 * i, 0.007, px([1250, 1560, 1250, 1540][i]), 0.5)

# 5. A number is a setting: the fourth at the turn; the number in the new words, and its line on vars, lit; the vars sheet, the setting
#    lit and a thread to its dial, set; Jun's column, a thread from the dial, and one to every count of awards; another number, the
#    pull request and its reviewer asked; and, without words, the needle turned to it and back, the tenor going up a step with it and
#    coming back, over home
gw = lambda lid, word, off=0: W('setting', lid, word, off)
gc = lambda lid, off=0: G('setting', lid, off)
g0 = S0('setting')
chord(IV, g0 + 0.2, g0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
marker(gw('number', 'six credit points'), 0.007, px(900), 0.4); marker(END('setting', 'number') + 0.3, 0.007, px(900), 0.5)
kp, mn = gc('kept', -0.3), gw('kept', 'min award credit points')
paper(kp + 0.1, 0.014, px(800), 0.4); marker(gw('kept', 'as a setting'), 0.007, px(700), 0.5)
pencil(mn - 0.2, 0.008, px(1300), 0.9); tap(mn + 0.3, 0.008, px(1500))
rd = gc('reads', -0.3)
paper(rd + 0.1, 0.014, px(800), 0.4); marker(gw('reads', "Jun's new column"), 0.007, px(700), 0.5); tap(rd + 0.9, 0.007, px(1100))
pencil(gw('reads', 'reads it'), 0.008, px(1100), 0.9); pencil(gw('reads', 'every count of awards'), 0.008, px(700), 0.9)
rv = gw('agree', 'a reviewed pull request')
pencil(gw('agree', 'another number'), 0.008, px(560), 0.6)
paper(gw('agree', 'one line changes') - 0.1, 0.012, px(1390), 0.35)
keys(rv, 5, 0.007, px(1390), 0.14); knock(rv + 1.0, 0.010, px(1390), 300)
turn = END('setting', 'agree') + 0.2
chord({'ba': 38, 'tr': 66}, turn - 0.2, turn + 3.0, 0.5, step=0.15, att=0.6, rel=0.9)
line('te', [(turn, turn + 0.9, 57, 1.0), (turn + 0.9, turn + 1.8, 59, 1.0), (turn + 1.8, turn + 3.0, 57, 1.0)], 0.5, att=0.5)
tap(turn + 1.2, 0.006, px(560)); tap(turn + 2.4, 0.006, px(560))

# 6. Counted once: the fifth at the turn; the ledger, its rule pencilled a line at a time; the metric view's sheet, what it counts lit;
#    its pull request, its checks, and Mei's approval, the falling fourth; a thread to each report that reads it; Planning's own count
#    struck through, and the metric's in its place: in step, on the home chord
kw = lambda lid, word, off=0: W('count', lid, word, off)
kc = lambda lid, off=0: G('count', lid, off)
k0 = S0('count')
chord(V, k0 + 0.2, k0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
page(k0 + 0.2, 0.014, px(960))
for t, x_ in ((kw('meaning', 'which credentials count'), 700), (kw('meaning', 'in which year'), 1200), (kw('once', 'counted once'), 960)):
    pencil(t, 0.009, px(x_), 1.0)
mv = kw('once', 'as a metric view', -0.3)
paper(mv + 0.1, 0.014, px(700), 0.4)
for w_ in ('the credentials', 'count as an award', 'by the year'):
    marker(kw('what', w_), 0.006, px(700), 0.4)
bd, rv = kw('builds', 'builds it'), kw('builds', 'is reviewed')
paper(bd + 0.1, 0.012, px(1500), 0.35)
for k in range(3):
    tap(bd + 0.5 + 0.5 * k, 0.006, px(1500))
stamp(rv + 0.3, 0.014, px(1500)); approve(rv + 0.3, 0.7)
pencil(kw('reads', 'The draft submission'), 0.008, px(1100), 0.8); pencil(kw('reads', "Planning's census report"), 0.008, px(1100), 0.8)
way = kw('own', 'its own way')
strike(kw('own', 'Neither counts'), 0.010, px(960), 0.8)
instep(way + 0.3); chord(I, way + 0.2, E('count') + 0.3, 0.5, step=0.2, att=0.6, rel=0.8)

# 7. Agents read the same meaning: the third at the turn; Clara's question typed; Genie One's answer, its two citations, the page's in
#    step; its own guess pencilled and struck; the data team's agent, its source lit, the same question and the same answer, in step;
#    on the board, the three that read them, on the home chord
aw = lambda lid, word, off=0: W('agents', lid, word, off)
ac = lambda lid, off=0: G('agents', lid, off)
a0 = S0('agents')
chord(iii, a0 + 0.2, a0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
keys(aw('asks', 'Clara', 0.6), 10, 0.008, px(1000), 0.16)
ans, met, cite, guess = G('agents', 'answers'), aw('answers', 'from the metric'), aw('answers', "cites award's page"), aw('prefers', 'its own guess')
knock(ans + 0.1, 0.010, px(960), 260)
tap(met + 0.1, 0.007, px(700)); tap(cite + 0.1, 0.007, px(1000))
instep(cite + 0.2, 0.7)
pencil(guess - 0.3, 0.008, px(1400), 0.5); strike(guess + 0.4, 0.009, px(1400), 0.6)
marker(aw('prefers', 'shows where'), 0.006, px(800), 0.5)
bt, same = ac('built', -0.3), aw('built', 'gives the same answer')
tap(aw('built', 'on the metric'), 0.007, px(700)); keys(bt + 0.2, 8, 0.007, px(960), 0.14)
knock(same + 0.1, 0.010, px(960), 260); instep(same + 0.2, 0.6)
one, agr = ac('one', -0.3), aw('one', 'agents read')
for k, t in enumerate((aw('one', 'People'), agr, agr + 0.4)):
    pencil(t, 0.007, px([450, 960, 1470][k]), 0.6)
chord(I, one + 0.2, E('agents') + 0.3, 0.5, step=0.2, att=0.7, rel=0.8)

# 8. Three layers, one home each: the sheet pinned over Noor's map, on the fourth; each layer's row written; each home lit; a thread
#    to each copy; and the ticks, each copy checked against its home: in step, on the home chord
lw = lambda lid, word, off=0: W('layers', lid, word, off)
lc = lambda lid, off=0: G('layers', lid, off)
l0 = S0('layers')
paper(l0 + 0.2, 0.014, px(960), 0.45); pin(l0 + 0.45, 0.016, px(960))
chord(IV, l0 + 0.2, l0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
for w_ in ('what a word means', 'how a number is counted', 'how things relate'):
    pencil(lw('three', w_), 0.008, px(400), 0.6)
knock(lc('home', 0.1), 0.010, px(790), 280)
pencil(lw('words', 'the glossary copies'), 0.008, px(1200), 1.4); pencil(lw('relate', 'copied into the project'), 0.008, px(1200), 0.9)
pencil(lw('counts', 'serves as metric views'), 0.008, px(1200), 0.9)
ck = lc('checked')
for k in range(3):
    pencil(ck + 0.3 + 0.12 * k, 0.007, px([1300, 1650, 1300][k]), 0.25)
instep(ck + 0.4); chord(I, ck + 0.2, E('layers') + 0.3, 0.5, step=0.2, att=0.6, rel=0.8)

# 9. One meaning: home at the turn; a thread to each table, count and answer her words reach; the floor of offices, hers lit, and her
#    words carried to every office at once, the treble rising; submission day, both reports ticked, in step, and a thread from the
#    metric and the words to both; the next film's card lifts; and the end card, on the mark, the chord held to the end
zw = lambda lid, word, off=0: W('close', lid, word, off)
zc = lambda lid, off=0: G('close', lid, off)
z0 = S0('close')
chord(I, z0 + 0.2, z0 + 2.6, 0.5, step=0.2, att=0.6, rel=0.8)
for k, t in enumerate((zw('sees', 'every table'), zw('sees', 'count'), zw('sees', 'answer'), zw('sees', 'answer', 0.3))):
    pencil(t, 0.007, px([1250, 1560, 1250, 1540][k]), 0.5)
car = zw('decides', 'carries it everywhere')
knock(zw('decides', 'once', -0.3), 0.010, px(576), 280)
for i in range(4):
    air(car + 0.2 * i, 1.0, 0.005, px([192, 960, 1344, 1728][i]))
chord({'ba': 38, 'te': 57}, car - 0.2, car + 3.6, 0.5, step=0.15, att=0.6, rel=0.9)
line('tr', [(car, car + 1.0, 66, 1.0), (car + 1.0, car + 3.6, 69, 1.0)], 0.5, att=0.5)
bth = zw('day', 'both say')
pencil(bth + 0.8, 0.008, px(450), 0.3); pencil(bth + 0.95, 0.008, px(1470), 0.3); instep(bth + 0.8, 0.7)
pencil(zw('day', 'the same metric'), 0.007, px(960), 0.8); pencil(zw('day', 'the same words'), 0.007, px(960), 0.8)
bd, end = zc('breath', -0.3), zc('breath', 1.6)
knock(bd + 0.55, 0.010, px(505), 280); air(bd + 0.6, 0.9, 0.006, px(505))
chord({'te': 57, 'tr': 66}, end - 0.2, TOT, 0.55, step=0.2, att=0.9, rel=0.6)
mark(end + 0.6)
soften(2600)
