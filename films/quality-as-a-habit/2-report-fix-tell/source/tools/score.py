# Report, fix, tell: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette the module reserved for this film on 5 November 2026 (/mnt/project-files/data-quality/palettes.md), with the partner this
# film's thread chose, both made here (music.py has neither):
#  - The line, the lead: a string telephone made into an instrument, a long taut wire between two tins. Plucked, the wire's note comes
#    out of the tin at each end, hollow and a little nasal, and fades; stroked, it sings one even note for as long as the stroke lasts,
#    and stops. A message goes along the line, and an answer comes back. Soft, in the middle of the range; never held like an organ.
#  - The partner: tuned tins, struck softly with felt, the line's two ends. They sound only where a person answers or tells: a health
#    worker answering at once, Mei's team finding his name, the portal telling Andrés, the registrar's office writing to the 83, and at
#    the end. Short, round, the felt's soft start; never a bell's ring.
#  - The mark: a note plucked at one end, answered at the other a step higher, then a tin, once: E (the report), F sharp (its answer)
#    and A (a person tells). It sounds where every report was answered at once, under the title, when the portal answers him, and at
#    the end.
#  - A major for what's answered, fixed and told; F-sharp minor for the problem (the chain, the name printed wrong); E major where
#    something has to change; D major for a promise and for the guards at the door. Just intonation from A (see hz()), so nothing
#    beats; B sounds only with E or G sharp, never with D or F sharp: those aren't pure in this table.
# The rules every film of the module keeps (palettes.md, 5 November 2026):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse (film.json's "urgent" is empty). No
#    figure played again and again. Nothing from India's music: no instrument, scale or rhythm of the subcontinent, no bells.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (seven names, five rows) is one
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
R1 = np.random.default_rng(1975)  # this film's own randomness: the room, the felt, the touch

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats. A major (A C sharp
# E), D major (D F sharp A), E major (E G sharp B), F-sharp minor (F sharp A C sharp) and C-sharp minor (C sharp E G sharp) are pure in
# this table; B with D or with F sharp is not (32/27 and 40/27)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (57, 220.0)  # A 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D2, E2, Fs2, A2, Cs3, D3, E3, Fs3, Gs3, A3, B3 = 38, 40, 42, 45, 49, 50, 52, 54, 56, 57, 59
Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5, D5, E5 = 61, 62, 64, 66, 68, 69, 71, 73, 74, 76

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the stroked line a little under the plucked one, the tins with
# it; the effects well under the music (FX scales them all)
LL, SL, TL, FX = 0.110, 0.075, 0.100, 1.4

# a room round the line: a small, quiet room, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held), as
# the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
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

# ---- the tin at each end of the line: the wire's sound comes out of a tin, whose base and hollow lift a band in the middle of the
# range (about 600 Hz to 1 kHz) and a little above it, which gives the line its hollow, slightly nasal colour. A filter only shapes
# what the wire plays, so it adds no note of its own, and nothing beats
def _tinned(s, body=0.9, nose=0.4):
    s = s.astype(np.float32)
    return 0.55 * s + body * filt(s, 'band', (600, 1050)) + nose * filt(s, 'band', (1200, 1700))

# ---- the line, plucked: the wire set moving near one end, so its harmonics are strong and fade faster the higher they are; a soft
# touch of the finger; out through the tin. ring is how long it sings: short in the problem (the wire damped by the hand), longer
# where something is answered
def line(m, s, g=1.0, pan=0.0, ring=0.9, room=0.25):
    f = hz(m); sec = 5 * ring + 0.15; x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for k in range(1, 12):
        if f * k > 2300:
            break
        sig += abs(np.sin(np.pi * k * 0.17)) / k ** 1.1 * np.sin(2 * np.pi * f * k * x + 0.2 * k) * np.exp(-x * (1 + 0.55 * (k - 1)) / ring)
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec + 0.12) / 0.12, 0, 1)) ** 2
    y = _tinned(sig); nt = int(0.01 * SR)
    y[:nt] += filt(R1.standard_normal(nt).astype(np.float32), 'band', (700, 1800)) * np.exp(-np.arange(nt) / SR / 0.002) * 0.03
    put(_held(filt(y, 'low', 2300), room), s, g * LL, pan)

# ---- the line, stroked: drawn along with a rosined cloth, the wire sings one even note while the stroke lasts: it swells in, holds its
# level, and stops, ringing a moment. Its harmonics fall away quickly, nothing above 1.7 kHz; nothing trembles
def stroke(m, a, b, g=1.0, att=0.5, rel=0.8, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.4, b - a); n = int((sec + 5 * rel + 0.1) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) / rel), 1.0)
    s = np.sin(2 * np.pi * f * x)
    for k, h in ((2, 0.30), (3, 0.15), (4, 0.07), (5, 0.03)):
        if f * k < 1700:
            s = s + h * np.sin(2 * np.pi * f * k * x + 0.4 * k)
    s = s * on * off * np.cos(0.5 * np.pi * np.clip((x - n / SR + 0.1) / 0.1, 0, 1)) ** 2
    put(_held(filt(_tinned(s, 0.5, 0.15), 'low', 1700), room), a, g * SL, pan)

# ---- a tuned tin, struck softly with felt: a round note with the felt's soft start and a low thump, its second partial an octave up
# and a faint third that fades at once; no ring above 2 kHz. A person answering, or telling
def tin(m, s, g=1.0, pan=0.0, ring=0.7, room=0.3):
    f = hz(m); sec = 5 * ring + 0.1; x = tt(sec).astype(np.float64)
    sig = np.sin(2 * np.pi * f * x) * np.exp(-x / ring) + 0.22 * np.sin(2 * np.pi * 2 * f * x + 0.4) * np.exp(-x / (0.35 * ring))
    if 2.76 * f < 2000:
        sig += 0.08 * np.sin(2 * np.pi * 2.76 * f * x + 1.1) * np.exp(-x / (0.12 * ring))
    sig *= np.sin(0.5 * np.pi * np.minimum(1, x / 0.008)) ** 2
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec + 0.1) / 0.1, 0, 1)) ** 2
    nt = int(0.05 * SR); sig = sig.astype(np.float32)
    sig[:nt] += filt(R1.standard_normal(nt).astype(np.float32), 'band', (120, 500)) * np.exp(-np.arange(nt) / SR / 0.012) * 0.10
    put(_held(filt(sig, 'low', 2000), room), s, g * TL, pan)

def roll(notes, s, step=0.14, g=1.0, pan=0.0, ring=0.9, spread=0.3):
    """the line plucked note after note, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        line(m, s + step * i, g * (1.0 if i == 0 else 0.85) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), ring)

# ---- the mark: a note plucked at one end of the line (E, on the left), answered at the other a step higher (F sharp, on the right),
# then a tin, once, as a person tells (A, in the middle), over the stroked line's low A. s is when the first note is plucked
def mark(s, g=1.0, side=0.5, low=A2, hold=2.6):
    line(E4, s, g * 0.8, -side, ring=0.8)
    line(Fs4, s + 0.95, g * 0.8, side, ring=0.8)
    tin(A4, s + 1.9, g * 0.95, 0.0, ring=0.8)
    stroke(low, s + 1.8, s + 1.8 + hold, g * 0.7, att=0.7, rel=1.1)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a frame"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a chip, a tag, a row"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down: a certificate, a letter, a note"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something drawn across, a ring closing"""
    s_air(s, sec, g * FX, pan, lo, hi)
def click(s, g=0.011, pan=0.0):
    """a button pressed: a soft, dull click"""
    s_knock(s, g * FX, pan, 320); s_tap(s + 0.006, g * 0.7 * FX, pan)
def pen(s, sec=1.6, g=0.006, pan=0.0):
    """a pencil writing: one soft scratch that swells and fades, not a stroke for each letter"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def keys(s, n=4, step=0.5, g=0.006, pan=0.0):
    """a name typed: a few soft keys, never a burst"""
    for i in range(n):
        s_tap(s + step * i, g * FX, pan)

# =============================================================================================================================
# 1. Report a case: the opening, with music all through it.
#    India, 1974: F-sharp minor, the line plucked slowly, rising, as the lane comes in. Person to person: the line damped short, one
#    note at each door the mark reaches, falling. Back hard, 116,188 cases: the stroked C sharp under the card. It hid: two low
#    plucks. The plan: the chain from house to house, the damped line falling; the vaccinators' wave, one breath of air; the chain
#    finds the missed one: F sharp, low. "Something had to change": E major, rising. Search and contain: A major, at the door. The
#    reward, and every report answered at once: the mark, the woman's report on the right, the answer a step higher on the left, and
#    a tin as he writes it down. The guards, day and night, the ring, the chain stopped: D major. Paid: the line, high. Assam, the last
#    case: F-sharp minor, still. 1977 and 1980: A major, then D major. The university: a name printed wrong and printed again, F-sharp
#    minor; the empty folder, low. A report is worth what happens next: answer it, fix it, tell them, rising. The title: the mark
F = lambda lid, word, off=0: W('report', lid, word, off)
r0 = S0('report')
# India, 1974: the lane comes in, the line rising slowly in F-sharp minor over the stroked F sharp
stroke(Fs3, r0 + 0.3, F('place', 'the last years', 0.4), 0.7, att=1.2, rel=1.0)
line(Cs4, r0 + 1.0, 0.65, -0.25, ring=1.0); line(Fs4, r0 + 2.0, 0.6, 0.0, ring=1.0); line(A4, r0 + 3.0, 0.6, 0.25, ring=1.1)
# smallpox passed from person to person: the mark reaches each of the first four doors, 1.13 s apart; the line damped short, falling
tPer = F('disease', 'person to person')
for i, (m, x) in enumerate(((Fs4, 150), (E4, 453), (Cs4, 819), (A3, 1245))):
    line(m, tPer + 3.4 * i / 3, 0.55, px(x), ring=0.35)
stroke(D3, F('disease', 'killed', -0.2), F('disease', 'scarred', 0.6), 0.55, att=0.8, rel=0.9)
# back hard: the card, and the stroked C sharp under it as the camera draws in
knock(F('hard', 'more than', 0.0), 0.014, px(1440), 230)
stroke(Cs3, F('hard', 'more than', -0.3), F('hard', 'end of May', 0.6), 0.6, att=0.9, rel=0.9)
line(Gs3, F('hard', 'cases', 0.0), 0.45, 0.2, ring=0.7)
# it hid in villages and city streets: two low plucks, damped
line(Fs3, F('hid', 'villages', 0.0), 0.5, -0.3, ring=0.45); line(A3, F('hid', 'city streets', 0.0), 0.5, 0.3, ring=0.45)
# the plan: the chain passes from house to house (houses 1, 2 and 10), the line damped short, falling; a chain: the low F sharp
tC0, tCa = F('chain', 'passed'), F('chain', 'a chain')
stroke(Fs2, tC0 - 0.6, tCa + 0.9, 0.5, att=1.0, rel=0.9)
for k, (m, x) in enumerate(((Cs4, 520), (A3, 685), (Fs3, 720))):
    line(m, tC0 + (tCa - tC0 + 0.4) * k / 2, 0.5, px(x), ring=0.35)
# everyone vaccinated but a few: one breath of air as the wave of ticks crosses the village; the chain finds a missed one: F sharp, low
air(F('missed', 'Vaccinating', 0.0), 2.4, 0.008, -0.2, 150, 800)
tFound = F('missed', 'found the ones', 1.2)
line(Fs3, tFound, 0.55, px(898), ring=0.5); stroke(Cs3, tFound - 0.2, tFound + 1.8, 0.45, att=0.6, rel=0.8)
# something had to change: E major, rising; every chain found (its marks outlined) and stopped where it was (the ring, dashed)
tSo = F('change', 'Something had to change')
stroke(E3, tSo - 0.2, F('change', 'stopped', 0.8), 0.6, att=0.9, rel=1.0)
line(B3, F('change', 'every chain', 0.0), 0.5, -0.2, ring=0.8); line(E4, F('change', 'found', 0.0), 0.5, 0.0, ring=0.8)
line(Gs4, F('change', 'stopped', 0.0), 0.55, 0.2, ring=1.0)
# search and contain: A major, as the door comes in and the health worker walks to it
tSe = F('search', "So India's")
stroke(A2, tSe - 0.4, tSe + 2.6, 0.6, att=1.0, rel=1.0)
line(Cs4, F('search', 'search, and contain', 0.0), 0.55, px(640), ring=0.9); line(E4, F('search', 'contain', 0.0), 0.55, px(640), ring=1.0)
# more than 100,000 health workers: the card
knock(F('house', 'More than', 0.0), 0.014, px(410), 230)
# the reward: the poster; the woman reports, on the right; every report was answered at once: the answer on the left, a step higher,
# and a tin as he writes it down; one soft scratch of the pencil; the chip
paper(F('reward', 'a reward', 0.0), 0.010, px(1100), 0.4)
line(E4, F('reward', 'Anyone who reported', 0.1), 0.6, px(1380), ring=0.8)
line(Fs4, F('reward', 'every report', 0.0), 0.6, px(640), ring=0.8)
tin(A4, F('reward', 'at once', 0.0), 0.8, px(700), ring=0.7)
pen(F('reward', 'every report', 0.2), 2.0, 0.005, px(700))
tap(F('reward', 'at once', 0.1), 0.008, px(1376))
stroke(D3, F('reward', 'at once', -0.1), END('report', 'reward') + 0.6, 0.5, att=0.8, rel=0.9)
# the guards, by day and by night; the ring drawn; everyone inside vaccinated; the chain stopped there: D major
line(D4, F('guards', 'Guards', 0.0), 0.5, -0.1, ring=0.7); line(Fs4, F('guards', 'night', 0.0), 0.5, 0.1, ring=0.7)
air(F('guards', 'everyone around', 0.0), 1.4, 0.008, 0.0, 160, 800)
tap(F('guards', 'vaccinated', 0.2), 0.008, 0.0)
tSt = F('guards', 'the chain stopped')
stroke(D3, tSt - 0.2, tSt + 2.6, 0.6, att=0.7, rel=1.0); line(A4, tSt + 0.3, 0.55, 0.0, ring=1.0)
# whoever reported was paid: the note handed over, the chip; the line, high
paper(F('paid', 'was paid', -0.3), 0.010, px(1000), 0.35)
tap(F('paid', 'was paid', 0.5), 0.008, px(850))
line(Cs5, F('paid', 'was paid', 0.1), 0.5, px(850), ring=0.9)
# Assam, May 1975: the platform at dusk, quiet; the ring round it; India's last case: F-sharp minor, still
tLa = F('last', 'In May')
stroke(Fs2, tLa - 0.5, F('last', 'last case', 1.0), 0.55, att=1.2, rel=1.0)
air(F('last', 'last case', -0.3), 1.4, 0.008, px(1090), 150, 700)
line(A3, F('last', 'last case', 0.2), 0.5, px(1090), ring=1.0)
tap(F('last', 'last case', 0.1), 0.008, px(1090))
# 1977, India free: A major; 1980, the world: D major, and the low A under it
t77, t80 = F('free', 'nineteen seventy-seven'), F('free', 'nineteen eighty')
knock(t77, 0.013, px(440), 230); roll((A3, Cs4, E4), t77 + 0.1, 0.16, 0.7, px(440), ring=1.0)
knock(t80, 0.013, px(1530), 230); roll((D4, Fs4, A4), t80 + 0.1, 0.16, 0.7, px(1530), ring=1.1)
stroke(A2, F('free', 'the world', -0.2), F('free', 'the world', 2.4), 0.55, att=0.8, rel=1.0)
# the university: a certificate on the granite; the name printed wrong, ringed: F-sharp minor; printed again; the chips
tUn = F('uni', 'At the university')
paper(tUn - 0.4, 0.010, px(580), 0.45)
stroke(Fs2, F('uni', 'printed wrong', -0.3), F('uni', 'a case too', 0.8), 0.5, att=0.8, rel=0.9)
line(Cs4, F('uni', 'printed wrong', 0.0), 0.5, px(580), ring=0.5)
tap(F('uni', 'printed wrong', 0.4), 0.008, px(580))
paper(F('folder', 'printed again', -0.2), 0.010, px(1360), 0.45)
tap(F('folder', 'printed again', 0.4), 0.008, px(1360))
# a graduate crosses the stage with an empty folder: two low plucks
line(A3, F('folder', 'a graduate', 0.3), 0.45, px(700), ring=0.7); line(Fs3, F('folder', 'empty folder', 0.0), 0.45, px(900), ring=0.9)
# a report is worth what happens next: the button, then answer it, fix it, tell them, rising in A major; and the next is found
click(F('worth', 'A report', -0.1), 0.010, px(960))
for w_, m, x in (('answer it', E4, 560), ('fix it', A4, 960), ('tell them', Cs5, 1360)):
    tap(W('report', 'worth', w_, 0.0), 0.007, px(x)); line(m, W('report', 'worth', w_, 0.05), 0.5, px(x), ring=0.8)
stroke(E3, F('worth', 'the next', -0.2), END('report', 'worth') + 0.4, 0.5, att=0.7, rel=0.9)
# the title: the mark, over the stroked low A, and the line's A major ringing out
tB = G('report', 'breath', 0.2)
mark(tB, 1.0, hold=2.6)
roll((A3, Cs4, E4), tB + 2.9, 0.18, 0.6, ring=1.1)

# 2. This isn't my name: a turn in D major, as his room comes in; the name shown, plain; two taps for the two marks; the button and a
#    few keys as he types his name; his report sent along the line, the plucked E; the record and its three passing tags, one tap each;
#    after "in capitals", a pause: the low C sharp; "People find errors no check can see": A major; his report's rows; and the portal's
#    promise, the answer a step higher, F sharp, over D major, into the pause
M = lambda lid, word, off=0: W('mine', lid, word, off)
m0 = S0('mine')
stroke(D3, m0 + 0.3, m0 + 3.0, 0.55, att=0.8, rel=0.9); line(A4, m0 + 0.8, 0.5, 0.1, ring=1.0); line(Fs4, m0 + 1.8, 0.45, -0.1, ring=1.0)
line(Cs4, M('reads', 'Andres Penaloza', 0.1), 0.4, px(700), ring=0.5)
tap(M('marks', 'No accent', 0.1), 0.008, px(640)); tap(M('marks', 'No tilde', 0.1), 0.008, px(860))
click(M('presses', 'presses', 0.0), 0.010, px(1180))
keys(M('presses', 'and types', 0.1), 4, 0.55, 0.005, px(960))
line(E4, END('mine', 'presses') + 0.3, 0.55, px(1180), ring=0.9)
for w_, x in (('No check', 420), ('short', 760), ('every letter', 1100)):
    tap(M('held', w_, 0.05), 0.008, px(x))
tap(M('form', 'His record', 0.05), 0.007, px(850)); tap(M('form', 'in capitals', 0.05), 0.007, px(850))
stroke(Cs3, END('mine', 'form') + 0.05, END('mine', 'form') + 1.5, 0.45, att=0.5, rel=0.8); line(Gs3, END('mine', 'form') + 0.15, 0.4, 0.0, ring=0.7)
tap(M('typed', 'typed again', 0.05), 0.007, px(850))
tPe = M('people', 'People')
stroke(A2, tPe - 0.2, END('mine', 'people') + 0.9, 0.55, att=0.6, rel=1.0); line(E4, M('people', 'no check', 0.0), 0.5, 0.0, ring=1.0)
for w_ in ('who', 'the name shown', 'the name given'):
    tap(M('row', w_, 0.05), 0.007, px(1500))
tOf = M('next', "The registrar's office")
line(Fs4, tOf + 0.1, 0.55, px(1300), ring=1.0)
stroke(D3, tOf - 0.1, END('mine', 'next') + 0.4, 0.5, att=0.8, rel=0.9)

# 3. To the owner, with a promise: the report goes along the line from the portal, on the right, to Mei on the left (E, then C sharp,
#    over the low A); its due date, a tag; two working days, D; the ledger, one soft sheet for its rows; the two cards; the weekly
#    review; the morning's alert; and in India, a promise kept: D major, the line high
O = lambda lid, word, off=0: W('owner', lid, word, off)
o0 = S0('owner')
stroke(A2, o0 + 0.5, o0 + 3.4, 0.55, att=0.8, rel=0.9); line(E4, o0 + 0.9, 0.55, px(1500), ring=0.8); line(Cs4, o0 + 2.5, 0.5, px(700), ring=1.0)
tap(O('promise', 'Their promise', 0.05), 0.008, px(1100))
tap(O('promise', 'two working days', 0.05), 0.007, px(700)); line(D4, O('promise', 'two working days', 0.1), 0.45, px(700), ring=0.9)
paper(O('model', 'Every report', -0.1), 0.010, px(1200), 0.5)
knock(O('do', 'what people do', 0.0), 0.012, px(1540), 240); knock(O('do', 'whether the data', 0.0), 0.012, px(870), 240)
tap(O('weekly', 'reviewed every week', 0.05), 0.007, px(1400))
click(O('alert', 'Each morning', -0.2), 0.009, px(1200)); tap(O('alert', 'which reports', 0.1), 0.007, px(1200))
tKe = O('again', 'a promise kept')
paper(O('again', 'In India', -0.3), 0.009, px(1150), 0.4)
stroke(D3, tKe - 0.2, END('owner', 'again') + 1.0, 0.55, att=0.7, rel=1.0); line(A4, tKe + 0.1, 0.5, px(1150), ring=1.0)

# 4. Fixed where it started: Mei's team checks his name; it matches, and a tin, once, as they find it (her answer); the correction in
#    the student system, A; that night, the fix travels along the line to every copy at once, one rising roll; the dashed cards, a
#    knock each; like guards at the door: D major
S = lambda lid, word, off=0: W('source', lid, word, off)
s0 = S0('source')
tap(S('passport', 'passport', 0.05), 0.008, px(1100))
tin(A4, S('system', 'It matches', 0.0), 0.75, px(1000), ring=0.7)
tap(S('system', 'correct it', 0.05), 0.008, px(1100)); line(E4, S('system', 'correct it', 0.1), 0.5, px(1100), ring=0.9)
tap(S('system', 'itself', 0.1), 0.007, px(900))
tNi = S('night', 'That night', 0.4)
roll((A3, Cs4, E4, A4), tNi + 0.2, 0.9, 0.65, 0.0, ring=0.9, spread=1.2)
knock(S('undone', 'Fixed in the list', 0.0), 0.012, px(460), 230); tap(S('undone', 'undone', 0.1), 0.007, px(640))
knock(S('copy', 'Fixed in a spreadsheet', 0.0), 0.012, px(1290), 230); tap(S('copy', 'wrong again', 0.1), 0.007, px(1100))
tGu = S('door', 'Like guards')
knock(tGu - 0.3, 0.012, px(960), 220)
stroke(D3, tGu - 0.2, END('source', 'door') + 1.2, 0.55, att=0.8, rel=1.0); line(Fs4, S('door', 'stops it there', 0.0), 0.5, 0.0, ring=1.0)

# 5. Tell them: the portal answers him: the mark; his room, a smile; in India, the reporter paid, the line; October's numbers, a tap
#    each; every one was told, a tin; what it cost: F-sharp minor; the note to admissions; from November, the line, A; Redman's
#    customers and creators, a tap each, and "what an error cost" told to the creators: a tin, then the low A
T5 = lambda lid, word, off=0: W('tell', lid, word, off)
t0 = S0('tell')
mark(T5('told', 'tells him', 0.0), 1.0, hold=2.2)
paper(T5('paid', 'In India', -0.6), 0.009, px(960), 0.4)
line(D4, T5('paid', 'was paid', 0.0), 0.5, px(960), ring=0.9)
tap(T5('month', 'In October', 0.3), 0.007, px(960))
tap(T5('right', 'Sixty-one', 0.05), 0.007, px(960)); tap(T5('right', 'three waited', 0.05), 0.007, px(960))
tin(Cs5, T5('right', 'Every one', 0.1), 0.6, px(960), ring=0.6)
stroke(Fs2, T5('cost', 'what it cost', -0.3), T5('cost', 'a graduate', 1.4), 0.5, att=0.7, rel=0.9)
line(A3, T5('cost', 'a graduate', 0.0), 0.45, px(650), ring=0.8)
paper(T5('note', 'The admissions team', -0.4), 0.010, px(650), 0.45)
tap(T5('october', 'thirty-eight', 0.05), 0.007, px(650)); tap(T5('october', 'eleven', 0.05), 0.007, px(650))
knock(T5('asks', 'So from November', 0.0), 0.012, px(1460), 240)
line(A4, T5('asks', 'their passport', 0.0), 0.5, px(1460), ring=0.9)
tap(T5('redman', 'customers', 0.05), 0.007, px(560)); tap(T5('redman', 'creators', 0.05), 0.007, px(1360))
tin(E4, T5('redman', 'tell the creators', 0.0), 0.6, px(1360), ring=0.7)
stroke(A2, T5('redman', 'what an error cost', -0.1), END('tell', 'redman') + 1.0, 0.5, att=0.8, rel=1.0)

# 6. Every case, a check: Redman's words leave, then Jun and the reports; where errors are born, C-sharp minor; 19 and 12, a tap each;
#    each kind of error becomes a check: A, and the card; its three lines; the stack; where a name was born, E; it holds them, the tag;
#    dbt keeps them; 83 on its first night, one breath of air as the count rises, and the low C sharp; the letter to each of them, a
#    tin; seven accents given back, one rising roll; the issue log; and the ring, as in India: D major
K = lambda lid, word, off=0: W('check', lid, word, off)
k0 = S0('check')
paper(k0 + 0.6, 0.009, px(1190), 0.45)
stroke(Cs3, K('born', 'where errors are born', -0.2), K('born', 'where errors are born', 2.2), 0.5, att=0.7, rel=0.9)
line(Gs4, K('born', 'where errors are born', 0.1), 0.45, px(1190), ring=0.9)
tap(K('born', 'nineteen', 0.05), 0.007, px(700)); tap(K('born', 'twelve', 0.05), 0.007, px(1200))
tBe = K('becomes', 'becomes a check')
knock(tBe - 0.2, 0.013, px(880), 240)
stroke(A2, tBe - 0.2, tBe + 2.4, 0.5, att=0.7, rel=0.9); line(Cs5, tBe + 0.2, 0.5, px(880), ring=0.9)
for w_ in ('a name the old form made', 'still in plain letters', 'not yet confirmed'):
    tap(K('adds', w_, 0.05), 0.006, px(880))
paper(K('accent', 'missing accent', -0.4), 0.008, px(1560), 0.35)
tap(K('accent', 'where a name was born', 0.05), 0.007, px(1560)); line(E4, K('accent', 'where a name was born', 0.1), 0.45, px(1560), ring=0.9)
tap(K('holds', 'It holds', 0.05), 0.008, px(1180))
knock(K('holds', 'dbt keeps', 0.0), 0.012, px(1170), 240)
t83 = K('first', 'eighty-three')
air(t83 - 0.6, 1.2, 0.007, px(1170), 160, 800); stroke(Cs3, t83 - 0.3, t83 + 2.0, 0.45, att=0.6, rel=0.9)
tLe = K('letter', 'writes to each')
paper(K('letter', 'The registrar', -0.2), 0.010, px(1000), 0.45)
tin(A4, tLe + 0.1, 0.65, px(1000), ring=0.7)
tSv = K('seven', 'seven')
roll((A3, Cs4, E4, A4), tSv + 0.3, 0.7, 0.6, px(1190), ring=0.9, spread=0.8)
tap(tSv + 2.8, 0.008, px(1196))
knock(K('log', 'Mei logs it', -0.3), 0.012, px(1150), 240); tap(K('log', 'issue log', 0.1), 0.007, px(1150))
tRi = K('ring', 'As in India')
stroke(D3, tRi - 0.4, END('check', 'ring') - 0.8, 0.55, att=0.9, rel=0.8)
line(Fs4, K('ring', 'vaccinated', 0.0), 0.5, 0.0, ring=0.9); line(A4, K('ring', 'before the chain', 0.0), 0.5, 0.0, ring=1.0)

# 7. Every report answered: India after the last case, at dusk: the reward rose, the card, the line's E; "Not smallpox" at each door,
#    a tap; it was gone: A; the university, every report answered and the check that holds; his certificate as he writes it, a tin;
#    and the end: the mark, then A major ringing out under the end card
C = lambda lid, word, off=0: W('close', lid, word, off)
c0 = S0('close')
knock(C('after', 'the reward rose', 0.0), 0.013, px(1490), 230); line(E4, C('after', 'the reward rose', 0.1), 0.55, px(1490), ring=0.8)
tap(C('after', 'every report', 0.4), 0.008, px(453)); tap(C('gone', 'None', 0.0), 0.008, px(1245))
line(A4, C('gone', 'it was gone', 0.1), 0.55, 0.0, ring=0.9)
paper(C('uni', 'At the university', -0.6), 0.009, px(1090), 0.45)
tap(C('uni', 'becomes a check', 0.05), 0.008, px(1260))
paper(C('cert', 'certificate', -0.8), 0.010, px(950), 0.45)
tin(Cs5, C('cert', 'certificate', 0.6), 0.6, px(1330), ring=0.7)
tE = C('take', 'Answer', -0.1)
mark(tE, 1.0, hold=4.2)
roll((A3, Cs4, E4, A4), G('close', 'breath', 0.4), 0.2, 0.6, ring=1.2)
