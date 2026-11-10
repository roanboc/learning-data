# A reason to keep it: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A
# new palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's other films
# (/mnt/project-files/data-protection/palettes.md, where this film's thread took it): an oboe d'amore and a low marimba, both made here.
#  - The oboe d'amore, the "oboe of love" of the early 1700s that Bach wrote for in his cantatas: pitched a minor third below the oboe,
#    its pear-shaped bell softening it, so it is warmer and gentler than an oboe. One voice, played softly, no vibrato: a double reed's
#    full row of harmonics, rounded by the bell, nothing above 2.3 kHz. Under the opening it is the people who came to be tested, for
#    themselves and for the people they loved; after it, it plays only where a reason is said, holding that reason's note while the
#    record is kept for it, and letting it go when the reason ends (Linh's yes, held, and let go when she says no).
#  - A marimba, low in its range, struck softly with yarn mallets and damped short: wood, which no other film of this module plays. Its
#    bars are tuned so their one overtone sits two octaves up, and yarn wakes nothing higher. The six reasons are six notes of one
#    chord, A major's five-note scale with no semitone (A, B, C sharp, E, F sharp, A), struck one at a time as each reason appears:
#    agreed A, contract B, law C sharp, public task E, a life F sharp, a fair interest the high A. Each record is a note on its
#    reason's; a piece with no reason gets no note.
#  - A major; F-sharp minor for the problem (what the names could cost). Every chord is tuned pure (just intonation from A, see hz()):
#    A, D and E major and F-sharp and C-sharp minor are pure in this table; B with F sharp is not, so the two never sound together.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story (chapter 1), and after it only at a chapter's turn, under a moment on screen
#    or in a pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato, and no urgent pulse (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (ten pieces dropping in, a row of
#    outlines) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1986)  # this film's own randomness: the room, the breath, the rain

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (45, 110.0)  # A 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A2, B2, Cs3, D3, E3, Fs3, Gs3 = 45, 47, 49, 50, 52, 54, 56
A3, B3, Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5 = 57, 59, 61, 62, 64, 66, 68, 69, 71, 73
# each reason's note, as the band in the hall holds them: one chord, struck one at a time
NOTE = {'agreed': A3, 'contract': B3, 'law': Cs4, 'task': E4, 'life': Fs4, 'fair': A4}

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the oboe a little under the marimba's strokes; the effects about
# 16 dB under the music (FX scales them all)
ML, OL, FX = 0.098, 0.050, 1.9

# a room round the players: a high hall of glass panes, ringing on for about a second and a half, nothing much above 1.8 kHz. Its level is
# set by what it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level in it
# (_held), as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.025 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so the
    note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the marimba, low, with yarn mallets: a tuned bar sounds its first mode and, two octaves up, its overtone, which dies at once; the
# soft mallet wakes nothing higher, and its touch is a low, short thud. Damped short: a note rings about a second, the low ones longer
def mallet(m, s, g=1.0, pan=0.0, room=0.24):
    f = hz(m); d1 = 0.6 if f < 160 else 0.5 if f < 260 else 0.42
    sec = 1.5; x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / d1)
    if 4 * f < 2300:
        sig = sig + 0.2 * np.sin(2 * np.pi * 4 * f * x + 0.5) * np.exp(-x / 0.06)
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.006)) ** 2
    nt = int(0.03 * SR); th = filt(noise(0.03)[:nt], 'low', 450) * np.exp(-np.arange(nt) / SR / 0.008) * 0.06
    sig[:nt] += th
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.2) / 0.2, 0, 1)) ** 2
    put(_held(filt((sig / max(1e-9, float(np.abs(sig).max()))).astype(np.float32), 'low', 2300), room), s, g * ML, pan)
def roll(notes, s, step=0.12, g=1.0, pan=0.0, spread=0.25):
    """bars struck one after another, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        mallet(m, s + step * i, g * (1.0 if i == 0 else 0.85) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5))
def reason(k, s, g=0.8, pan=0.0):
    """a reason, or a record kept for it: its note on the marimba"""
    mallet(NOTE[k], s, g, pan)

# ---- the oboe d'amore: a double reed in a conical bore, so every harmonic sounds, the middle ones strongest; the pear-shaped bell rounds
# off the top, and nothing sounds above 2.3 kHz. The higher harmonics speak a moment after the first; a little air at the reed as the
# note starts, and a faint breath under it. Held steady, with no vibrato; a note of 1.2 s or more swells a little and eases, once
def damore(m, a, b, g=1.0, att=0.12, rel=0.45, pan=0.1, room=0.28):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(2300 // f) + 1):
        fk = f * k
        w = (0.7 if k == 1 else 1.0) / k ** 0.5 * (0.5 + 0.5 * np.exp(-np.log(fk / 800) ** 2 / (2 * 0.45 ** 2))) * np.exp(-max(0.0, fk - 1300) / 350)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.06 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.4 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.37 * k)
    if sec >= 1.2:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    nz = noise(n / SR + 0.01)[:n]
    s = s + filt(nz, 'band', (500, 1600)) * 0.02 * np.exp(-x / 0.03) + filt(nz, 'band', (300, 1300)) * 0.004 * np.where(x < sec, 1.0, np.exp(-(x - sec) * 20))
    put(_held(filt(s.astype(np.float32), 'low', 2200), room), a, g * OL, pan)
def line(notes, s, g=1.0, pan=0.1, last=2.0):
    """a phrase: [(note, length), ...], each note joined to the next, the last held for `last` seconds"""
    t = s
    for i, (m, d) in enumerate(notes):
        e = t + (last if i == len(notes) - 1 else d)
        damore(m, t, e + (0.06 if i < len(notes) - 1 else 0), g * (0.92 if i else 1.0), att=0.1 if i else 0.16, rel=0.25 if i < len(notes) - 1 else 0.8, pan=pan)
        t += d

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.013, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a slip or a line set in place"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet laid down, or drawn out"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def strike(s, g=0.007, pan=0.0, sec=0.35):
    """a line drawn quickly: a mark on a form, or a row struck out"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, frost thinning, a pane clearing"""
    s_air(s, sec, g * FX, pan, lo, hi)
def slide(s, sec=0.9, g=0.008, pan=0.0):
    """a card slid across a counter or out of a stack: a low brush of paper on wood"""
    x = tt(sec); X(filt(noise(sec), 'band', (160, 1100))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)
def rain(s, sec, g=0.0035, pan=0.0):
    """rain in the street, as one soft texture that swells in and fades: never drops one by one"""
    x = tt(sec); e = np.minimum(1, x / 1.2) * np.minimum(1, np.maximum(0, sec - x) / 1.6)
    X(filt(noise(sec), 'band', (300, 1800))[:len(x)] * e, s, g * FX, pan)

# =============================================================================================================================
# 1. Under a number (the opening, with music all through it). Oregon at evening, in the rain: the oboe's theme, the people who came to
#    be tested, over the marimba's low A. Inside: the new test, D major; what it needs, two notes as its two needs appear; the name
#    written with the result, the card filed, kept private. The street: he stops at the door and walks on: F-sharp minor, and the oboe
#    falls. The list of names; the card slides out (the fear); what it could cost, three low notes going down. Inside: the people they
#    love, across the street. Something has to change: E major, open. Name, or a number: A major. The number on the tube. By day: he came
#    back, the counts rise, the oboe rising; the chairs full. The hall: a piece could get out; a reason lands on it, and the oboe holds
#    its note; the pane clears; the title, A major
S = lambda lid, word, off=0: W('number', lid, word, off)
s0 = S0('number')
rain(s0 + 0.1, 5.9, 0.0035, px(1100))
mallet(A2, s0 + 0.4, 0.75, px(700)); mallet(E3, s0 + 0.55, 0.6, px(1200))
line([(A3, 0.7), (Cs4, 0.7), (E4, 1.3), (D4, 0.7), (Cs4, 0)], s0 + 0.9, 0.85, px(1000), last=2.2)
# inside: the counsellor, the new test; what it needs
roll((D3, A3, D4), G('number', 'test', 0.1), 0.14, 0.6, px(1500))
tap(S('needs', 'a sample', 0.15), 0.008, px(1000)); mallet(E4, S('needs', 'a sample', 0.2), 0.5, px(1000))
tap(S('needs', 'a way', 0.15), 0.008, px(1000)); mallet(Cs4, S('needs', 'a way', 0.2), 0.5, px(1000))
# the name written down with the result: the card up from the tray, filed behind the frosted door, kept private
paper(S('names', 'name with', -0.2), 0.009, px(1210), 0.4)
damore(E4, S('names', 'name with', 0.0), S('names', 'private', -0.6), 0.7, att=0.4, rel=0.4, pan=px(1100))
slide(S('names', 'private', -1.1), 1.1, 0.007, px(820))
knock(S('names', 'private', 0.05), 0.010, px(640), 200)
damore(D4, S('names', 'private', -0.5), S('names', 'private', 1.6), 0.66, att=0.25, rel=0.9, pan=px(800))
tap(S('names', 'private', 0.25), 0.007, px(640))
# the street again: he comes to the door, stops, and walks on
rain(G('number', 'away', -1.0), 6.0, 0.0032, px(900))
roll((Fs3, Cs4), G('number', 'away', 0.6), 0.16, 0.55, px(880))
line([(Cs4, 0.6), (A3, 0)], W('number', 'away', 'stay away', 0.2), 0.7, px(880), last=1.8)
# a private list is still a list of names: the frost thins; one card slides out, its rim coral
air(S('list', 'list of names', 0.0), 1.1, 0.007, px(400), 200, 1000)
slide(S('fear', 'could get out', 0.0), 0.8, 0.008, px(560))
damore(Fs3 + 12, S('fear', 'could get out', 0.1), S('fear', 'could get out', 1.4), 0.6, att=0.3, rel=0.6, pan=px(600))
# what it could cost: three tags, a low note going down for each
for w_, m in (('job', Cs3), ('home', A2), ('health insurance', Fs3 - 12)):
    mallet(m, S('cost', w_, 0.1), 0.55, px(1060)); knock(S('cost', w_, 0.1), 0.008, px(1060), 220)
# inside, the empty chairs; across the street, two people at their kitchen table: the people they love
roll((D3, A3), S('know', 'the people they love', -0.3), 0.18, 0.5, px(460))
line([(A3, 0.55), (Cs4, 0.55), (D4, 0)], S('know', 'the people they love', 0.0), 0.75, px(460), last=2.0)
# something has to change: E major, left open
roll((E3, Gs3, B3), G('number', 'change', 0.05), 0.16, 0.55, px(860))
damore(E4, G('number', 'change', 0.1), END('number', 'change') + 1.0, 0.7, att=0.3, rel=0.8, pan=px(860))
# December 1986: a name, or a number
tap(S('choose', 'December', 0.1), 0.007, px(1100))
knock(S('choose', 'their name', 0.0), 0.011, px(1050), 240)
knock(S('choose', 'or a number', 0.0), 0.011, px(1380), 260)
roll((A2, E3, A3, Cs4), S('choose', 'or a number', 0.05), 0.13, 0.75, px(1250))
line([(E4, 0.6), (A4, 0)], S('choose', 'or a number', 0.25), 0.8, px(1250), last=2.2)
# the number on a tube's label: the sample matched to the person
tap(S('does', 'matches', 0.3), 0.008, px(1046))
mallet(Cs4, S('does', 'matches', 0.5), 0.45, px(1100)); mallet(E4, S('does', 'matches', 0.75), 0.45, px(1100))
# by day: he has come back, the number in his hand; his result slid onto the counter; the counts rise; the chairs full
slide(S('does', 'come back', 0.6), 1.3, 0.007, px(1500))
mallet(A3, S('rose', 'forty-two', 0.0), 0.5, px(900))
line([(A3, 0.45), (Cs4, 0.45), (E4, 0)], S('rose', 'hundred', 0.0), 0.75, px(1100), last=2.0)
mallet(Cs4, S('found', 'eighty-five', 0.0), 0.5, px(1100)); mallet(A3, S('found', 'thirty-six', 0.0), 0.45, px(900))
roll((D3, A3), W('number', 'health', 'protect', -0.4), 0.18, 0.45, px(470))
line([(Cs4, 0.5), (E4, 0.5), (A4, 0)], W('number', 'health', 'protect', 0.0), 0.75, px(470), last=2.0)
# the hall: one piece; it could get out (coral); ask what it is for; a reason lands, and the oboe holds its note; the pane clears
mallet(Fs3, S('same', 'could get out', 0.0), 0.5, px(960)); mallet(Cs4, S('same', 'could get out', 0.2), 0.4, px(960))
tap(S('ask', 'what each piece', 0.0), 0.007, px(960))
reason('agreed', S('ask', 'only what', 0.0), 0.7, px(960))
damore(A3, S('ask', 'only what', 0.1), G('number', 'trust', 0.3), 0.7, att=0.4, rel=0.4, pan=px(960))
air(G('number', 'trust', 0.0), 1.6, 0.007, px(960), 200, 1100)
damore(Cs4, G('number', 'trust', 0.35), G('number', 'breath', -0.1), 0.62, att=0.3, rel=0.5, pan=px(960))
# the title card
tT = G('number', 'breath', 0.0)
roll((A2, E3, A3, Cs4, E4), tT, 0.15, 0.8)
damore(A4 - 12, tT + 0.2, E('number') + 0.3, 0.6, att=0.8, rel=1.2, pan=0.0)

# 2. What is it for? (from here, music only now and then). Ingrid's card; the tutors of 2027; Linh's card and her contract. Her record
#    in pieces, dropping in as one soft rustle (none has a reason yet, so none has a note). The earlier film's card; "for: HR purposes";
#    the outlines, "for: ?", one breath of air. A reason said in a sentence: bank details, to pay her: the marimba's B for the contract,
#    and the oboe holds it while the slip is there. Two outlines turn coral: a low knock
F = lambda lid, word, off=0: W('whatfor', lid, word, off)
knock(F('today', 'Ingrid Holm', -0.2), 0.011, px(185), 240)
tap(F('ready', "next year's tutors", 0.0), 0.007, px(960))
knock(F('linh', 'Linh Nguyen', 0.0), 0.011, px(960), 250)
tap(F('linh', 'Her last contract', 0.1), 0.007, px(1400))
air(G('whatfor', 'pieces', -0.2), 1.0, 0.006, px(960), 200, 900)
paper(G('whatfor', 'pieces', 0.9), 0.008, px(960), 1.8)
knock(F('written', 'For this purpose only', 0.0), 0.010, px(1740), 240)
tap(F('anything', 'anything', 0.0), 0.007, px(951))
air(F('asks', 'really for', 0.3), 1.4, 0.006, px(960), 200, 1000)
tSn = F('sentence', 'in a sentence', -0.4)
reason('contract', tSn, 0.75, px(960))
damore(B3, tSn + 0.1, G('whatfor', 'hold', -0.3), 0.66, att=0.4, rel=0.7, pan=px(960))
knock(F('hold', "shouldn't hold", 0.0), 0.008, px(1300), 180)

# 3. Six reasons. The band comes in: a breath of air; the GDPR's tag. Each reason as it is named: its note, rising through the chord.
#    Then each record lands on its reason, a note on its reason's: the contract's B three times, the law's C sharp three times, her yes,
#    Mei's public task. The two with no reason get no note: their frost thickens, a breath of air, and nothing more
X6 = lambda lid, word, off=0: W('six', lid, word, off)
air(X6('allows', 'what allows it', 0.0), 1.0, 0.006, px(960), 200, 1000)
tap(X6('gdpr', "Europe's", 0.0), 0.007, px(1100))
for k in ('agreed', 'contract', 'law', 'task', 'life', 'fair'):
    reason(k, G('six', k, -0.05), 0.8, px((470, 640, 800, 1000, 1220, 1430)[('agreed', 'contract', 'law', 'task', 'life', 'fair').index(k)]))
FD = 0.6
for lid, w_, k, x_ in (('rests', 'contracts', 'contract', 460), ('rests', 'hours', 'contract', 700), ('rests', 'bank details', 'contract', 950),
                       ('bylaw', 'tax number', 'law', 1200), ('bylaw', 'pay records', 'law', 1450), ('bylaw', 'date of birth', 'law', 460),
                       ('yes', 'her yes', 'agreed', 700), ('mei', 'public task', 'task', 1450)):
    reason(k, X6(lid, w_, FD - 0.15), 0.6, px(x_))
tap(X6('bylaw', 'pension', 0.2), 0.006, px(400))
tap(X6('yes', 'send me news', 0.2), 0.006, px(600))
knock(X6('mei', "Mei's", 0.2), 0.010, px(1740), 240)
air(X6('none', 'no reason at all', 0.0), 0.9, 0.006, px(1200), 150, 700)

# 4. As little as needed. The 2023 form; applying is a step toward a contract: its B. What no step used, marked; the forms of everyone who
#    applied, one rustle; what only payroll needs, marked. Every piece held could get out: the form's light swells, a breath. The 2027
#    form; payroll's two after the offer: the law's C sharp and the contract's B. The two with no reason, struck out and gone; deleted.
#    Like the clinics in Oregon: the oboe's E to A, as when a number was first offered
L = lambda lid, word, off=0: W('little', lid, word, off)
paper(G('little', 'form', -0.5), 0.009, px(960), 0.5)
reason('contract', L('step', 'a step toward a contract', 0.0), 0.7, px(1230))
tap(L('step', 'a step toward a contract', 0.1), 0.006, px(1400))
strike(L('asked', 'marital status', 0.0), 0.007, px(1300)); strike(L('asked', 'marital status', 0.6), 0.007, px(1300))
tap(L('asked', 'no step used', 0.2), 0.006, px(1400))
paper(L('everyone', 'everyone who applied', 0.0), 0.008, px(900), 0.6)
strike(L('everyone', 'date of birth', 0.0), 0.007, px(1300)); strike(L('everyone', 'date of birth', 0.6), 0.007, px(1300))
tap(L('payroll', 'once a tutor', 0.2), 0.006, px(1400))
air(L('held', 'could get out', 0.0), 1.0, 0.006, px(960), 150, 800)
paper(G('little', 'drops', 0.4), 0.009, px(960), 0.5)
tOf = L('after', 'after the offer', 0.0)
knock(tOf, 0.010, px(1530), 240)
reason('law', tOf + 0.05, 0.6, px(1530)); reason('contract', tOf + 0.4, 0.6, px(1530))
paper(G('little', 'deletes', 0.3), 0.008, px(960), 0.5)
strike(L('deletes', 'deletes', 0.4), 0.007, px(1200), 0.5); air(L('deletes', 'deletes', 0.5), 0.8, 0.006, px(1200), 150, 800)
knock(L('deletes', 'deletes', 1.0), 0.009, px(1074), 220)
line([(E4, 0.6), (A4, 0)], L('clinics', 'Like the clinics', 0.0), 0.7, px(185), last=1.8)

# 5. A yes that means it. The 2023 form's consent; the wrong reason: a knock; she says no: the tick taken off. Her pay records rest on a
#    law (its C sharp), her bank details on a contract (its B). A yes only where a no is a real choice: the oboe holds agreeing's A.
#    Oregon: the name or the number, as then (A major). The 2027 form opens; its one real question: the oboe's A, held while the rows
#    light. Her yes kept on the person: the marimba's A, and the oboe holds it while the yes is kept; when she says no, it lets go,
#    and her row leaves the list
Y = lambda lid, word, off=0: W('yes', lid, word, off)
paper(G('yes', 'said', -0.5), 0.009, px(960), 0.5)
knock(Y('wrong', 'wrong reason', 0.2), 0.009, px(1560), 200)
tap(Y('no', 'said no', 0.0), 0.007, px(545))
reason('law', Y('no', 'pay records', 0.0), 0.65, px(635))
tap(Y('no', 'a law requires', 0.0), 0.006, px(635))
reason('contract', Y('bank', 'bank details', 0.0), 0.65, px(915))
tRc = Y('real', 'real choice', 0.0)
damore(A3, tRc, END('yes', 'real') + 0.9, 0.62, att=0.4, rel=0.8, pan=px(960))
roll((A2, E3, A3, Cs4), Y('oregon', 'a name or a number', 0.0), 0.13, 0.6, px(185))
paper(G('yes', 'plainly', 0.3), 0.009, px(960), 0.5)
air(Y('plainly', 'plainly', 0.0), 1.0, 0.006, px(960), 200, 1000)
tap(Y('question', 'one real question', 0.0), 0.007, px(624))
damore(A3, Y('question', 'one real question', 0.1), Y('nothing', 'nothing else changes', 1.6), 0.6, att=0.5, rel=0.9, pan=px(800))
air(Y('nothing', 'nothing else changes', 0.0), 1.4, 0.005, px(960), 200, 900)
tKp = G('yes', 'kept', 0.3)
knock(tKp, 0.010, px(660), 240)
reason('agreed', tKp + 0.1, 0.7, px(660))
tNo = Y('built', 'says no', 0.0)
damore(A3, tKp + 0.2, tNo + 0.2, 0.6, att=0.6, rel=0.6, pan=px(660))
air(Y('built', 'built each semester', 0.0), 1.6, 0.006, px(1280), 200, 1000)
tap(tNo + 0.2, 0.007, px(660))
strike(Y('built', 'leaves her out', 0.0), 0.007, px(1280), 0.5); air(Y('built', 'leaves her out', 0.2), 0.8, 0.005, px(1280), 150, 800)

# 6. Before a new use. Clara's card; her request. Held to employ and pay tutors: the contract's B; asked to plan: no reason, no note.
#    The privacy check; its questions, a tap for each line; the answers; the counts it allows, one breath as the rows fill, "no names";
#    which reason allows it: public task, its E. Ingrid signs (a person decides): the oboe holds the task's E until the plan is set; data
#    governance keeps the check: a knock. Oregon: counts with no names, the oboe rising as the counts rose. The deeper check: a knock
U = lambda lid, word, off=0: W('newuse', lid, word, off)
knock(U('clara', 'Clara Jensen', 0.0), 0.011, px(1740), 250)
paper(U('clara', "the tutors' records", 0.0), 0.009, px(1320), 0.45)
reason('contract', U('new', 'employ and pay', 0.0), 0.65, px(480)); tap(U('new', 'employ and pay', 0.05), 0.006, px(480))
tap(U('new', 'not to plan', 0.0), 0.006, px(1200))
paper(U('check', 'privacy check', 0.0), 0.009, px(700), 0.5)
air(G('newuse', 'check', 0.0), 1.0, 0.005, px(1320), 200, 900)
for lid in ('q1', 'q2', 'q3'):
    tap(G('newuse', lid, 0.05), 0.006, px(600))
for t_ in (U('needs', 'Clara needs', 0.0), U('needs', 'hours by unit', -0.3), U('needs', 'hours by unit', 0.8)):
    tap(t_, 0.006, px(560))
paper(U('needs', 'hours by unit', 1.2), 0.008, px(1320), 0.45)
air(U('needs', 'hours by unit', 1.4), 1.2, 0.005, px(1320), 200, 900)
knock(U('needs', 'no names', 0.3), 0.008, px(1450), 230)
reason('task', U('needs', 'no names', 0.5), 0.65, px(470))
tap(U('small', 'small units', 0.0), 0.006, px(560))
tap(U('signs', 'who owns the data', 0.0), 0.006, px(560))
tSg = U('signs', 'signs yes', 0.0)
knock(tSg, 0.010, px(400), 240)
damore(E4, tSg + 0.1, END('newuse', 'signs') + 0.4, 0.6, att=0.5, rel=0.9, pan=px(600))
knock(U('signs', 'data governance', 0.0), 0.008, px(950), 300)
line([(A3, 0.45), (Cs4, 0.45), (E4, 0)], U('counts', 'In Oregon', 0.0), 0.62, px(1320), last=1.8)
knock(U('deeper', 'deeper check', 0.3), 0.010, px(1320), 240)

# 7. A reason you can say. Her contract ends: its tick. Every piece she has, each lit in turn with its reason: a note for each, on its
#    reason's. Next: a tap. She asks, and Ingrid can answer (a person answered): the oboe rises to C sharp. Oregon again, by day: the
#    opening's theme, the people who came. The end card: A major; the last breath: the open A, and the oboe's A
K = lambda lid, word, off=0: W('reason', lid, word, off)
paper(G('reason', 'ends', -0.5), 0.008, px(960), 0.45)
tap(K('ends', 'contract ends', 0.6), 0.007, px(1230))
tEv = K('every', 'a reason it can say', 0.0)
for j, k in enumerate(('contract', 'contract', 'contract', 'law', 'law', 'law', 'agreed', 'task')):
    reason(k, tEv + 0.3 * j, 0.5 + 0.05 * (j % 2), px((460, 700, 950, 1200, 1450, 460, 700, 1450)[j]))
tap(K('next', 'comes next', 0.0), 0.006, px(690))
paper(K('answer', 'When she asks', 0.6), 0.009, px(700), 0.5)
air(K('answer', 'what, and why', -0.6), 1.4, 0.005, px(700), 200, 1000)
line([(A3, 0.55), (Cs4, 0)], K('answer', 'what, and why', 0.0), 0.62, px(700), last=2.2)
tOr = G('reason', 'oregon', -0.4)
mallet(A2, tOr + 0.2, 0.6, px(900)); mallet(E3, tOr + 0.35, 0.5, px(1100))
line([(A3, 0.7), (Cs4, 0.7), (E4, 1.3), (D4, 0.7), (Cs4, 0)], tOr + 0.6, 0.72, px(1100), last=1.6)
tEnd = G('reason', 'keep', -0.2)
roll((A2, E3, A3, Cs4, E4), tEnd, 0.15, 0.7)
damore(A4 - 12, tEnd + 0.3, G('reason', 'trust', 0.2), 0.55, att=0.6, rel=1.0, pan=0.0)
tB = G('reason', 'breath', 0.3)
roll((A2, E3), tB, 0.2, 0.6)
damore(A3, tB + 0.3, E('reason') - 0.2, 0.5, att=1.0, rel=1.4, pan=0.0)
