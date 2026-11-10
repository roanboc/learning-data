# Show the least: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A new
# palette, reserved for this film on 5 November 2026 (/mnt/project-files/data-protection/palettes.md: neither "keyed bugle", "bugle" nor
# "baryton" in any score.py on main or any branch, nor in any palettes list): a keyed bugle and a baryton, both made here (music.py has
# neither).
#  - The keyed bugle, the brass bugle with keys over its tone holes that bands played in the first half of the 1800s: a wide conical
#    bore, so a round, mellow tone, its first few harmonics strong and the rest falling away fast; played softly, one voice, no vibrato.
#    It is the public count: plain phrases, each one different, as a band would play them in 1856; a key closed over a hole, and the
#    tune still carries. It plays the opening's tune, a short phrase at each chapter's turn, and the totals.
#  - The baryton, the bowed bass of the 1700s with a second set of wire strings hidden in its neck, which ring unbowed in sympathy
#    behind the played ones: what is hidden is still there. Low and soft, only where a hidden value can be brought back: the study's
#    sealed key (a keyed hash), Britain's sealed packet of 1872 and the token's vault; and under the last title, with the bugle.
#  - B flat major for the colony and the count; G minor under the problem (a vote said out loud); F, the dominant, at "Something had
#    to change", which resolves to B flat as the paper goes into the box. Tuned pure (just intonation from B flat, see hz()), so no chord
#    beats: B flat, E flat and F major, G and D minor are pure in this table; C minor is not (27:32:40), so no C minor chord.
# The rules the module keeps (its briefs, 5 November 2026, as the site's other films do):
#  - Music only from time to time: under the opening story (the 1856 part, the bugle alone), and after it only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and
#    how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; no urgent pulse (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen (nine tiles) is one
#    soft sound, never one for each.
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
R1 = np.random.default_rng(1856)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (46, 116.541)  # B flat 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the bugle's notes, in its middle range, and the baryton's, low
F3, G3, A3, Bb3, C4, D4, Eb4, F4, G4, A4, Bb4, C5, D5 = 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74
F2, G2, A2, Bb2, C3, D3 = 41, 43, 45, 46, 48, 50

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the baryton a little under the bugle; the effects about 16 dB under
# the music (FX scales them all)
BL, YL, FX = 0.050, 0.044, 1.4

# a room round the players: a small timber hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (_band: its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level after it
# (_held), as the video guidelines ask
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
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

# ---- the keyed bugle: a brass horn with a wide conical bore, so its tone is round and mellow, the first few harmonics strong and the
# rest falling away fast, its warmth near 700 Hz, nothing above 2.2 kHz; the higher harmonics speak a moment after the first, the lips'
# soft buzz as a note starts. Held steady, with no vibrato; a note of a second or more swells a little and eases, once
def bugle(m, a, b, g=1.0, att=0.08, rel=0.32, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.2, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(2200 // f) + 1):
        fk = f * k
        w = np.exp(-(k - 1) * 0.6) * (1 + 0.6 * np.exp(-((fk - 700) / 300) ** 2))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.3 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (5.0 + 0.9 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.5 * k)
    if sec >= 1.0:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    lips = filt(noise(n / SR + 0.01)[:n], 'band', (400, 1500)) * 0.012 * np.exp(-x / 0.045)
    put(_held(filt((s + lips).astype(np.float32), 'low', 2200), room), a, g * BL, pan)
def phrase(notes, s, g=1.0, pan=0.0, last=1.4):
    """a plain bugle phrase: (note, length) pairs one after another, the last held for last seconds and let go"""
    t = s
    for i, (m, d) in enumerate(notes):
        e = t + (last if i == len(notes) - 1 else d)
        bugle(m, t, e - 0.03, g * (1.0 if i == len(notes) - 1 else 0.9), rel=0.5 if i == len(notes) - 1 else 0.25, pan=pan)
        t += d

# ---- the baryton: a bowed bass of gut strings, a little nasal (its body rings near 450 Hz and 1.1 kHz), bowed softly with a slow
# start and a faint, even rosin hiss; behind it, the wire strings in its neck ring unbowed in sympathy: the note's octave, twelfth and
# fifteenth, very faint, rising as the bow plays and ringing on after it stops, a shimmer that fades. Exact harmonics, so nothing beats;
# no vibrato
def baryton(m, a, b, g=1.0, att=0.4, rel=0.7, pan=0.1, room=0.3):
    f = hz(m); sec = max(0.5, b - a); ring = 2.2; n = int((sec + ring + 0.2) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(1800 // f) + 1):
        fk = f * k
        w = (1.0 / k ** 0.8) * (1 + 0.8 * np.exp(-((fk - 450) / 160) ** 2) + 0.4 * np.exp(-((fk - 1100) / 260) ** 2))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.0 + 0.6 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.3 * k)
    s = s / max(1e-9, float(np.abs(s).max()))
    bow = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1400)) * 0.006 * np.where(x < sec, 1.0, np.exp(-(x - sec) * 25))
    sym = np.zeros(n)
    for r, amp in ((2, 0.08), (3, 0.045), (4, 0.03)):
        if f * r < 2000:
            sym = sym + amp * np.minimum(1, x / max(0.3, sec)) * np.where(x > sec, np.exp(-(x - sec) / (ring / 2.5)), 1.0) * np.sin(2 * np.pi * f * r * x + r)
    put(_held(filt((s + bow + sym).astype(np.float32), 'low', 2000), room), a, g * YL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card set down, the paper landing in the box"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a row lit, a tile forward, a value changed"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def stroke(s, g=0.008, pan=0.0, sec=0.3):
    """a pen drawn quickly across a name, or a tick on the roll"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def fold(s, g=0.010, pan=0.0):
    """a paper folded: a soft crease"""
    x = tt(0.22); X(filt(noise(0.22), 'band', (300, 1600))[:len(x)] * np.sin(np.pi * x / 0.22) ** 3, s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: a curtain drawn, things moving across, frost forming"""
    s_air(s, sec, g * FX, pan, lo, hi)
def chalk(s, sec=1.2, g=0.006, pan=0.0):
    """chalk on the board, one soft texture"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * (0.7 + 0.3 * np.sin(2 * np.pi * 2.0 * x) ** 2), s, g * FX, pan)
def glassknock(s, g=0.012, pan=0.0):
    """a pane closing: a dull knock of glass"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.008, g * 0.5 * FX, pan)
def seal(s, g=0.016, pan=0.0):
    """wax sealed: a soft, low press"""
    s_knock(s, g * FX, pan, 140); x = tt(0.12); X(filt(noise(0.12), 'band', (150, 900))[:len(x)] * np.exp(-x / 0.03), s + 0.01, g * 0.4 * FX, pan)

# =============================================================================================================================
# 1. The roll and the box: Victoria, 1856, with the bugle all through the 1856 part.
#    Election eve: the tune's first phrase, B flat rising, held on F. A vote said out loud, anyone could learn it: one low D, alone, as
#    the last of them is named. What it could cost: E flat falling to D. "Something had to change": C rising to F, the dominant, left
#    open. The Act: F, B flat, D, rising. The official's tick, the paper handed over; behind the curtain, three names struck and the
#    paper folded; the curtain; the paper goes into the box: A rising to B flat, the tune home. The count: chalk, and a plain phrase.
#    Free to vote: D, F, B flat. Britain and America: G falling to F. The roll, then the box: a two-note figure, F then D. The cut to
#    the hall: one held B flat, then silence. The title: D falling to B flat
B = lambda lid, word, off=0: W('ballot', lid, word, off)
b0 = S0('ballot')
phrase(((Bb3, 0.7), (D4, 0.7), (F4, 0.7)), b0 + 0.5, 0.9, last=2.0)
bugle(D4, END('ballot', 'aloud') + 0.15, END('ballot', 'aloud') + 1.4, 0.8, att=0.25, rel=0.6)
phrase(((Eb4, 0.55), (D4, 0.55)), END('ballot', 'cost') + 0.1, 0.8, last=1.0)
phrase(((C4, 0.5), (F4, 0.5)), B('dare', 'Something', 0.0), 0.75, last=1.6)
knock(G('ballot', 'passed', 0.5), 0.012, px(1580), 250)
phrase(((F4, 0.5), (Bb4, 0.5), (D5, 0.5)), END('ballot', 'passed') + 0.1, 0.8, last=1.3)
# the hand-over and the booth, timed as the picture is (scenes.js: P)
hand = B('roll', 'handed')
stroke(B('roll', 'marked', 0.1), 0.007, px(660), 0.25)
paper(hand - 0.3, 0.008, px(800), 0.3)
paper(hand + 0.4, 0.008, px(830), 0.25)
in0 = G('ballot', 'alone', 0.1); shut0 = in0 + 0.85; ins0 = shut0 + 0.3
fold0 = max(B('alone', 'folded'), ins0 + 1.55); open0 = fold0 + 0.7; out1 = open0 + 1.1; drop0 = out1 + 0.05
air(shut0, 0.6, 0.007, px(1600), 200, 1000)
s0 = ins0 + 0.35
for k in range(3):
    stroke(s0 + 0.4 * k, 0.008, px(1573), 0.28)
fold(fold0 + 0.05, 0.010, px(1573))
air(open0, 0.5, 0.006, px(1600), 200, 1000)
knock(drop0 + 0.4, 0.012, px(995), 200)
phrase(((A4, 0.45), (Bb4, 0.45)), drop0 + 0.4, 0.85, last=1.8)
# the count, and what the ballot gave
chalk(G('ballot', 'count', 0.3), 1.4, 0.006, px(960))
phrase(((Bb3, 0.45), (C4, 0.45), (D4, 0.45)), END('ballot', 'count') + 0.1, 0.75, last=1.2)
knock(G('ballot', 'free', 0.3), 0.012, px(1560), 240)
phrase(((D4, 0.5), (F4, 0.5), (Bb4, 0.5)), G('ballot', 'free', 0.35), 0.7, last=1.4)
knock(G('ballot', 'spread', 0.3), 0.012, px(1560), 240)
phrase(((G4, 0.55), (F4, 0.55)), END('ballot', 'spread') + 0.05, 0.7, last=1.1)
knock(G('ballot', 'who', 0.2), 0.012, px(380), 240); bugle(F4, G('ballot', 'who', 0.25), G('ballot', 'who', 1.1), 0.7)
knock(B('who', 'The box'), 0.012, px(1350), 240); bugle(D4, B('who', 'The box', 0.05), B('who', 'The box', 0.9), 0.7)
# today, at the university: one held B flat as the hall comes in, then silence under the voice
bugle(Bb3, G('ballot', 'today', -0.3), G('ballot', 'today', 2.0), 0.7, att=0.3, rel=0.9)
knock(G('ballot', 'today', 1.2), 0.010, px(540), 250)
knock(G('ballot', 'kept', 0.1), 0.012, px(540), 250)
tap(B('kept', 'names', -0.2), 0.007, px(540)); tap(B('kept', 'birthdays', -0.2), 0.007, px(540)); tap(B('kept', 'disability', -0.2), 0.007, px(540))
air(B('all', 'Hide it all', 0.2), 0.7, 0.006, px(540), 200, 1000)
air(G('ballot', 'mei', 0.2), 0.7, 0.006, px(540), 200, 1000)
glassknock(B('follows', 'never sees', 0.0), 0.010, px(540))
tap(B('follows', 'never sees', -0.6), 0.007, px(540))
# the title
phrase(((D4, 0.6), (Bb3, 0.6)), G('ballot', 'breath', 0.3), 0.7, last=2.2)

# 2. Three questions: a rising phrase at the turn, C, D, F. A soft tap as each class is named; the nine ways come forward as one soft
#    breath; a tap as each question lights
Q = lambda lid, word, off=0: W('questions', lid, word, off)
q0 = S0('questions')
phrase(((C4, 0.45), (D4, 0.45), (F4, 0.45)), q0 + 0.25, 0.7, last=1.2)
for w_ in ('direct', 'indirect', 'special', 'none'):
    tap(Q('class', w_, -0.1), 0.007, px(540))
air(Q('nine', 'There are nine', 0.1), 1.9, 0.007, px(960), 200, 1000)
for lid in ('see', 'undo', 'works'):
    tap(G('questions', lid, 0.0), 0.007, px(960))

# 3. Ways that can't be undone: E flat, D, B flat at the turn, falling. The support table closes: a dull knock of glass. Each way's card
#    set down as it comes; a tap where a column changes; the help desk's card; the small course; the rows filtered, one soft breath
O = lambda lid, word, off=0: W('oneway', lid, word, off)
o0 = S0('oneway')
phrase(((Eb4, 0.45), (D4, 0.45), (Bb3, 0.45)), o0 + 0.25, 0.7, last=1.2)
glassknock(O('out', "isn't given"), 0.012, px(540))
for t_ in (G('oneway', 'out', 0.2), O('names', 'mask them whole'), G('oneway', 'part', 0.1), O('born', 'generalise it'), O('rows', 'filter rows')):
    knock(t_, 0.010, px(1480), 260)
tap(O('stars', 'reads as stars'), 0.007, px(540))
knock(G('oneway', 'desk', 0.4), 0.010, px(1480), 250)
tap(O('part', 'the last two digits'), 0.007, px(1480)); tap(O('part', 'the first letter'), 0.007, px(1480))
tap(O('born', 'becomes', 0.2), 0.007, px(540))
knock(G('oneway', 'anon', 0.4), 0.010, px(1480), 250)
knock(G('oneway', 'rows', 0.3), 0.010, px(1480), 250)
air(O('rows', 'gets only'), 1.6, 0.006, px(1480), 200, 1000)

# 4. Ways that can be undone: D, E flat, D at the turn, a turn that comes back. The registrar's list laid down; a tap where it matches;
#    the number scrambled, then keyed. The study's sealed key: the baryton's B flat, its hidden strings ringing on. 1872: the paper, the
#    counterfoil, the packet sealed, and the baryton's low F. The token's vault: the baryton's D. Encryption: frost forming, and
#    clearing for an allowed reader
U = lambda lid, word, off=0: W('undo', lid, word, off)
u0 = S0('undo')
phrase(((D4, 0.45), (Eb4, 0.45), (D4, 0.45)), u0 + 0.25, 0.7, last=1.2)
paper(G('undo', 'plain', 0.4), 0.009, px(1300), 0.35)
tap(U('plain', 'scrambles'), 0.007, px(540)); tap(U('plain', 'anyone can match', 0.1), 0.007, px(1300))
tap(U('keyed', 'a keyed hash'), 0.007, px(540))
knock(U('keyed', 'secret key', -0.2), 0.010, px(1420), 230)
baryton(Bb2, U('keyed', 'secret key', -0.1), U('keyed', 'secret key', 1.9), 0.8, pan=px(1420))
knock(G('undo', 'with', 0.3), 0.010, px(1480), 260)
tap(G('undo', 'still', 0.3), 0.007, px(540))
paper(G('undo', 'n1872', 0.4), 0.010, px(640), 0.4)
paper(U('n1872', 'matched', -0.3), 0.010, px(1320), 0.4)
paper(U('n1872', 'sealed packet', -0.4), 0.009, px(1450), 0.35)
seal(U('n1872', 'sealed packet'), 0.014, px(1450))
baryton(F2, U('n1872', 'sealed packet', 0.05), U('n1872', 'sealed packet', 2.3), 0.85, pan=px(1450))
knock(G('undo', 'token', 0.4), 0.010, px(1480), 260)
tap(U('token', 'stand-in'), 0.007, px(540))
knock(U('token', 'in a vault', -0.2), 0.010, px(1420), 230)
baryton(D3, U('token', 'in a vault', -0.1), U('token', 'in a vault', 1.7), 0.75, pan=px(1420))
knock(U('noone', 'keyed hash'), 0.010, px(1480), 260)
knock(G('undo', 'lock', 0.2), 0.010, px(1480), 260)
air(G('undo', 'lock', 0.4), 0.9, 0.007, px(1480), 300, 1400)
air(U('lock', 'all there'), 0.6, 0.006, px(1480), 300, 1400)

# 5. Totals, small counts hidden: B flat, D at the turn, plain. The totals laid down; a tap as Midwifery's 4 reads "fewer than 10" and
#    as the 17 is hidden; the answer: F, A, B flat. Back at the count of 1856: the opening's rising tune, on to the octave
T = lambda lid, word, off=0: W('totals', lid, word, off)
t0 = S0('totals')
phrase(((Bb3, 0.5), (D4, 0.5)), t0 + 0.25, 0.7, last=1.2)
paper(G('totals', 'left', 0.2), 0.010, px(460), 0.4)
tap(T('fewer', 'fewer than ten'), 0.007, px(460))
knock(G('totals', 'fewer', 0.4), 0.010, px(1480), 260)
tap(T('back', 'gives the four back', -0.6), 0.007, px(460))
tap(G('totals', 'more', 0.3), 0.007, px(460))
knock(T('answer', 'about nine in ten', -0.3), 0.010, px(1480), 250)
phrase(((F4, 0.45), (A4, 0.45), (Bb4, 0.45)), END('totals', 'answer') + 0.1, 0.7, last=1.3)
phrase(((Bb3, 0.5), (D4, 0.5), (F4, 0.5), (Bb4, 0.5)), G('totals', 'vote', -0.3), 0.75, last=1.6)
tap(T('vote', 'everyone sees', -0.2), 0.007, px(1400)); tap(T('vote', 'nobody sees', -0.2), 0.007, px(1300))

# 6. Show the least: G, F, D at the turn, coming down. A tap as each way is linked to its line of the agreement; the study's row; the
#    card for later films; the panes of the roll, the box and the totals; the end card: the bugle's B flat, F, B flat over the
#    baryton's low B flat, its hidden strings ringing on as the film ends
L_ = lambda lid, word, off=0: W('least', lid, word, off)
l0 = S0('least')
phrase(((G4, 0.45), (F4, 0.45), (D4, 0.45)), l0 + 0.25, 0.7, last=1.2)
for lid in ('code', 'year', 'nonames', 'nohealth', 'faculty'):
    tap(G('least', lid, -0.1), 0.007, px(1230))
tap(L_('faculty', 'only totals', -0.1), 0.007, px(1230))
knock(G('least', 'newclass', -0.3), 0.010, px(540), 250)
knock(G('least', 'build', 0.2), 0.010, px(1480), 260)
air(G('least', 'agent', 0.2), 0.8, 0.006, px(1330), 200, 1000)
for w_ in ('roll', 'box', 'totals'):
    tap(L_('least', w_, -0.2), 0.007, px(1440))
tE = G('least', 'breath', 0.4)
phrase(((Bb3, 0.6), (F4, 0.6), (Bb4, 0.6)), tE, 0.85, last=2.6)
baryton(Bb2, tE + 0.1, E('least') - 0.6, 0.85, att=0.8, rel=1.4)
