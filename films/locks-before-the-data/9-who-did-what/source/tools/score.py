# Who did what: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A new
# palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's palettes list
# (/mnt/project-files/data-protection/palettes.md): a lujon and a bowed double bass, both made here (music.py has neither).
#  - The lujon leads: Bill Loughborough's instrument of the late 1950s, made in California, tuned metal plates, each over its own
#    chamber of a wooden box, struck softly with yarn mallets. Low and round: each plate's fundamental rings on in its chamber, the
#    chamber adds a little of the octave, and the plate's own higher modes die in a moment. Nothing trembles. Each note rings in its
#    box as each action is kept in the record, and the flight recorder of the opening is a box that keeps the last hours too.
#  - The bowed double bass is the people who read the record: low and plain, no vibrato, slow and sure. It enters under the
#    investigators' table in 1960, and comes back under the review's answers at the end.
#  - The mark: three plates, A, C and F, the last left to ring: the box that keeps. Warren's idea plays it, the title card, the record
#    that keeps everyone under their own name, the review's last tick, and the film's last line.
#  - The bell of every alert is a low plate struck twice, softly, on the effects: amber on screen, the same sound each time, so it's
#    learned once. It isn't music: it rings where a bell rings on screen.
#  - D minor for the lost Comets and the copied session; F major, its relative major, for the box, the record and the end. Every note
#    is tuned pure from D (hz()), so D minor, F major, B flat major, G minor and A minor are pure; nothing plays C with G, or B.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story (A box that survives and Kept where no crash can reach, to the title), and
#    after it only at a chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py
#    checks how much, how often and how loud.
#  - Nothing trembles or beats; an urgent pulse only in The night a session was copied (film.json's "urgent"): the bass's open strings
#    plucked, low and soft, from the bell to "another country", and from the first step to the last session ended. Nowhere else.
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
R1 = np.random.default_rng(1954)  # this film's own randomness: the room, the bow, the mallet

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D minor (D F A),
# F major (F A C), B flat major (B flat D F), G minor (G B flat D) and A minor (A C E) are all pure in this table; C with G is not
# (40/27), nor E with B, so neither pair is ever played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
# the notes by name (MIDI): D2 38, A1 33, B flat 1 34, C2 36, F2 41; D3 50, F3 53, A3 57, B flat 3 58, C4 60, D4 62, F4 65, A4 69
MARK = (57, 60, 65)  # the mark: A 3, C 4, F 4

# ---- the levels: the lujon and the bass as loud as the module's other music (its loud moments about -28 dB of full scale as one
# speaker plays the score, tools/quiet.py), the bass a little under; the effects about 16 dB under the music, as low as the governance
# films' (FX scales them all)
LJ, BB, PZ, FX = 0.088, 0.048, 0.056, 0.65

# a room round the players: a small, dry room, ringing on for about a second, and nothing much above 1.6 kHz. Its level is set by what
# it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), so a held note keeps its level, as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.016 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room):
    """a note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body (from a quarter of a
    second in to 0.3 s before its end; a short note, over all of it)"""
    r = _room(s, room)
    if not room:
        return r
    a, b = int(0.25 * SR), len(s) - int(0.3 * SR)
    if b - a < int(0.1 * SR):
        a, b = 0, len(s)
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the lujon: a metal plate over its own chamber, struck softly with a yarn mallet. The plate's first mode rings on, the lower
# notes longer; the chamber under it adds a little of the octave; the plate's second and third modes (2.76 and 5.4 times the first, a
# free bar's) die within a tenth of a second, so only the round note is left; the yarn's soft touch, 4 ms, and a low thump of it
def lujon(m, a, g=1.0, pan=0.0, room=0.24, ring=None):
    """one plate, struck at a"""
    f = hz(m); tau = ring or 1.05 * (146.8 / f) ** 0.35; sec = min(5.0, tau * 4.2)
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    s = np.sin(2 * np.pi * f * x) * np.exp(-x / tau)
    s += 0.16 * np.sin(2 * np.pi * 2 * f * x + 0.4) * np.exp(-x / (tau * 0.5))
    for r_, a_, d_ in ((2.76, 0.2, 0.08), (5.4, 0.07, 0.035)):
        if f * r_ < 2400:
            s += a_ * np.sin(2 * np.pi * f * r_ * x + 1.1) * np.exp(-x / d_)
    s *= np.minimum(1, x / 0.004)
    s *= np.minimum(1, (sec - x) / 0.2)  # the last of its ring let go, not cut
    th = int(0.04 * SR); s[:th] += filt(noise(0.04), 'low', 500)[:th] * np.exp(-np.arange(th) / SR / 0.008) * 0.05
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2300)
    put(_held(s, room).astype(np.float32), a, g * LJ, pan)

def plates(ms, a, g=1.0, spread=0.07, pan=(-0.15, 0.15)):
    """a few plates, struck from the lowest up, a moment apart"""
    for i, m in enumerate(ms):
        lujon(m, a + spread * i, g * (1.0 if i == 0 else 0.82), pan[0] + (pan[1] - pan[0]) * i / max(1, len(ms) - 1))

def mark(a, g=1.0, step=0.42, pan=0.05):
    """the mark: A, C and F, the last left to ring longer"""
    for i, m in enumerate(MARK):
        lujon(m, a + step * i, g * (0.85 if i < 2 else 1.0), pan, ring=(None if i < 2 else 1.5))

# ---- the double bass, bowed: a string driven by the bow, so all its harmonics, each about 1/k, shaped by the body's few resonances
# and its top rolled off; the bow's grain as it takes the string, then one steady level (no vibrato, no swell beyond the bow's start),
# and a slow release
def bow(m, a, b, g=1.0, pan=-0.12, room=0.3):
    """the bass, bowed from a to b"""
    f = hz(m); sec = max(0.6, b - a); att, rel = 0.22, 0.4
    n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for k in range(1, 40):
        fk = f * k
        if fk > 2000:
            break
        body = 1 + 0.6 * np.exp(-((fk - 110) / 45) ** 2) + 0.5 * np.exp(-((fk - 260) / 90) ** 2) + 0.3 * np.exp(-((fk - 520) / 160) ** 2)
        ak = body / k * np.exp(-fk / 1400)
        s += ak * np.minimum(1, x / (att * (1 + 0.04 * (k - 1)))) * np.sin(2 * np.pi * fk * x + 0.7 * k)
    s *= np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    gr = int(0.18 * SR); s[:gr] += filt(noise(0.18), 'band', (180, 900))[:gr] * np.sin(np.pi * np.arange(gr) / gr) * 0.04
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 1900)
    put(_held(s, room).astype(np.float32), a, g * BB, pan)

# ---- the bass's open strings plucked: the urgent pulse of the night a session was copied, and nowhere else. A string plucked low,
# its harmonics dying away, the higher sooner; a soft thump of the finger
def pizz(m, a, g=1.0, pan=-0.1):
    f = hz(m); sec = 1.0; x = tt(sec).astype(np.float64); s = np.zeros(len(x))
    for k in range(1, 12):
        fk = f * k
        if fk > 1500:
            break
        s += (1 / k ** 1.1) * np.exp(-x / (0.32 / (1 + 0.5 * (k - 1)))) * np.sin(2 * np.pi * fk * x + 0.5 * k)
    s *= np.minimum(1, x / 0.003)
    th = int(0.03 * SR); s[:th] += filt(noise(0.03), 'low', 300)[:th] * np.exp(-np.arange(th) / SR / 0.006) * 0.08
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 1200)
    put(s, a, g * PZ, pan)

def throb(a, b, step=0.625, g=1.0):
    """the pulse: the D string plucked on each beat, the A string on every third, swelling in and out with the scene"""
    k = 0; t = a
    while t < b - 0.05:
        f = min(1.0, (t - a) / 1.2 + 0.35, (b - t) / 1.2 + 0.35)
        pizz(33 if k % 4 == 2 else 38, t, g * f)
        t += step; k += 1

# ---- soft sounds, on the effects, all low-passed: the noises filtered twice, so almost nothing of them reaches above 2.5 kHz
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card or a row set down, a stamp"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled click: a lamp, a switch, a lock, a key of a typewriter"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """a card or a sheet laid on the glass: filtered noise with a swell"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (250, 1800)), 'low', 2000)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=140, hi=900):
    """something passing: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def strike(s, g=0.009, pan=0.0, sec=0.6):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (450, 1600)), 'low', 1800)[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def clink(s, g=0.007, pan=0.0):
    """a small key against its safe: a few soft metal partials, quickly gone"""
    x = tt(0.35)
    sig = (np.sin(2 * np.pi * 1180 * x) + 0.6 * np.sin(2 * np.pi * 1730 * x + 0.4) + 0.3 * np.sin(2 * np.pi * 2210 * x + 1.1)) * np.exp(-x / 0.06)
    sig *= np.minimum(1, x / 0.002)
    X(filt(sig.astype(np.float32), 'low', 2400), s, g * FX, pan)
def bell(s, g=0.012, pan=0.0):
    """the alert: a low plate struck twice, softly, the second a little quieter; the same each time"""
    for d, w in ((0.0, 1.0), (0.32, 0.7)):
        x = tt(1.6).astype(np.float64); f = hz(50)
        sig = (np.sin(2 * np.pi * f * x) + 0.22 * np.sin(2 * np.pi * 2 * f * x + 0.4) * np.exp(-x / 0.5)) * np.exp(-x / 0.55) * np.minimum(1, x / 0.004)
        X(filt(sig.astype(np.float32), 'low', 1500), s + d, g * w * FX, pan)
def spool(s, sec=2.4, g=0.006, pan=0.0):
    """the wire turning on its spools: one soft, even texture that swells in and out"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (200, 700)), 'low', 900)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def sea(s, sec=6.0, g=0.007):
    """a calm sea at night, very low"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (70, 380)), 'low', 500)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, 0.0)

# =============================================================================================================================
# 1. A box that survives. Melbourne, 1953, at night: D minor, an open fifth on the plates and the bass's D under it. His name; the
#    tank's card. The Comet crosses the window: two plates; the card; "Two have crashed": B flat under it. Over the sea, 1954: the sea,
#    very low, and D minor rolled slowly; the plane's light goes. The investigators' table: G minor, softly; the question marks. The
#    airport at dusk: F major, the planes flying again; on "fail the same way", one question mark and B flat falling to A. "Something
#    has to change": A major, held, unresolved, into the note
bw = lambda lid, word, off=0: W('box', lid, word, off)
bc = lambda lid, off=0: G('box', lid, off)
b0 = S0('box')
bow(38, b0 + 0.4, b0 + 5.4, 0.7)
plates((50, 57), b0 + 0.6, 0.75)
tap(b0 + 0.9, 0.008, px(700))                                  # the lamp
lujon(53, bw('warren', 'chemist', -0.2), 0.6, px(470))
knock(bw('warren', 'fuel tanks'), 0.012, px(1585))             # the tank's card
P_comet = bw('asked', 'two Comets')
plates((57, 62), P_comet - 0.4, 0.62, pan=(0.3, 0.5))
paper(bw('asked', 'first jet', -0.2), 0.012, px(1560))
bow(34, bw('asked', 'have crashed'), bw('asked', 'have crashed', 3.0), 0.6)
knock(bw('asked', 'have crashed'), 0.011, px(1560), 300)
P_sea = bc('more', -0.3)
sea(P_sea, 7.0, 0.008)
bow(38, P_sea + 0.2, P_sea + 5.6, 0.65)
plates((50, 53, 57), P_sea + 0.5, 0.6, spread=0.32)
paper(bw('more', 'no one on board'), 0.012, px(960))
P_tab = bc('left', -0.3)
plates((43, 46, 50), P_tab + 0.3, 0.55, spread=0.2)
paper(bw('left', 'what the crew'), 0.012, px(960))
for i in range(3):
    knock(bc('left', 0.6 + 0.4 * i), 0.008, px((700, 1240, 980)[i]), 280)
lujon(57, bc('guess', 0.3), 0.5, px(1200))
P_air = bc('again', -0.3)
plates((41, 53, 57, 60), P_air + 0.4, 0.6, spread=0.12)
lujon(58, bw('again', 'fail the same way'), 0.5, px(1180))
lujon(57, bw('again', 'fail the same way', 1.4), 0.5, px(1180))
P_ch = bc('change', 0.1)
bow(33, P_ch, b0 + ST['box']['dur'] + 0.9, 0.6)
plates((57, 61, 64), P_ch + 0.3, 0.5, spread=0.16)

# 2. Kept where no crash can reach. The note: three keys of a typewriter, and F major. The idea: the mark, and the wire turning on its
#    spools; "always kept", the box's light, and the bass's F. In the tail: two plates, C and F, as its glow comes up. The pilots' fear
#    and his boss: two cards laid on, no music. 1958: the box finished, F major fuller. Queensland, 1960: D minor, the bass's D; then
#    "Australia is the first": F major. The investigators' table: headphones set down; the bass enters under "investigators can hear";
#    a plate rings as the last minutes are heard. Every other plane: three ticks, and F major. The hall: the platform's record, one
#    plate; "Without one": the bass's D, the question marks; "With one": they turn to ticks, F major rising; the title: the mark, the
#    bass's F held under it
tw = lambda lid, word, off=0: W('tail', lid, word, off)
tc = lambda lid, off=0: G('tail', lid, off)
t0 = S0('tail')
for i in range(3):
    tap(t0 + 0.9 + 0.22 * i, 0.009, px(640))
plates((53, 57, 60), t0 + 1.0, 0.6, spread=0.18)
P_box = tw('box', 'A small box')
mark(P_box + 0.1, 0.7)
spool(tw('box', 'over and over', -0.2), 2.6, 0.006, px(1540))
P_kept = tw('box', 'always kept')
bow(41, P_kept, P_kept + 3.4, 0.6)
P_tl = tw('sits', 'in the tail')
plates((60, 65), P_tl, 0.55, pan=(0.4, 0.6))
paper(tc('spy', 0.2), 0.012, px(440)); paper(tw('spy', 'his boss'), 0.012, px(1060))
P_58 = tc('keeps', -0.3)
plates((41, 53, 57, 60, 65), P_58 + 0.4, 0.62, spread=0.1)
knock(P_58 + 0.6, 0.012, px(812), 220)                         # the finished box set on the bench
P_qld = tc('first', -0.3)
bow(38, P_qld + 0.2, P_qld + 4.8, 0.62)
plates((50, 53, 57), tw('first', 'one more crash', -0.1), 0.55, spread=0.25)
P_aus = tw('first', 'Australia is the first')
plates((53, 57, 60, 65), P_aus, 0.6, spread=0.1)
paper(P_aus, 0.012, px(960))
P_lost = tc('lost', -0.3)
knock(P_lost + 0.3, 0.012, px(760), 200)                       # headphones set down
P_hear = tw('lost', 'investigators can hear')
bow(41, P_hear, P_hear + 4.2, 0.62)
lujon(57, P_hear + 0.2, 0.5, px(1060))
P_fix = tw('lost', 'fix it on every')
for i in range(3):
    tap(P_fix - 0.3 + 0.6 + i * 0.5, 0.009, px((760, 1180, 1430)[i]))
plates((53, 60, 65), P_fix + 1.6, 0.55, spread=0.12)
P_pf = tc('platform', -0.3)
lujon(53, tw('platform', 'a recorder'), 0.5, px(960))
P_wo = tc('without', 0.0)
bow(38, P_wo, P_wo + 3.6, 0.55)
knock(tw('without', 'only guess', -0.4), 0.009, px(900), 280)
P_see = tw('with', 'see who did what')
for i in range(5):
    tap(P_see + 0.4 * i + 0.2, 0.008, px((740, 1060, 900, 640, 1160)[i]))
plates((53, 57, 60, 65), P_see + 0.3, 0.55, spread=0.35)
P_t = tc('breath')
mark(P_t + 0.4, 0.75)
bow(41, P_t + 0.5, S0('questions') - 0.6, 0.6)

# 3. Three questions, four memories. The four locks light, a tap each; the review's card: an open fifth on D; its questions laid on.
#    The four records: the bass's D, and an F; each row set down. "Already gone": the bass falls from B flat to A
qw = lambda lid, word, off=0: W('questions', lid, word, off)
qc = lambda lid, off=0: G('questions', lid, off)
for word in ('sign-ins', 'doors', 'power', 'changes'):
    tap(qw('locked', word, 0.1), 0.008, px(860))
P_rv = qw('review', 'security review')
paper(P_rv, 0.012, px(1500))
plates((50, 57), P_rv + 0.1, 0.55)
for lid in ('signed', 'power', 'changed'):
    paper(qc(lid, 0.1), 0.01, px(1500))
P_four = qc('four', -0.2)
bow(38, P_four, P_four + 3.4, 0.55)
lujon(53, P_four + 0.3, 0.5, px(960))
for lid, word in (('table', 'audit table'), ('github', "GitHub's"), ('directory', 'The directory'), ('storage', 'the storage')):
    knock(qw(lid, word, -0.2), 0.01, px(400), 250)
P_gone = qw('gone', 'already gone')
bow(34, P_gone - 0.3, P_gone + 1.9, 0.55)
bow(33, P_gone + 2.0, P_gone + 4.4, 0.55)

# 4. One record, out of reach. The four streams leave for the store: F and A, and a breath of air as they flow. The locked copy: a
#    lock. "Not even an admin": the coral rim, a knock. A record switched off: the switch, the bell; gone quiet: the bell. Everyone
#    under their own name: the mark. The agent's row; the lens. The pilots' fear: the bass's D; read to find out what happened: F major,
#    the bass's F under it
sw = lambda lid, word, off=0: W('store', lid, word, off)
sc_ = lambda lid, off=0: G('store', lid, off)
plates((53, 57), S0('store') + 0.6, 0.55, pan=(-0.4, -0.2))
air(sw('sent', 'one store apart', -0.2), 2.4, 0.007, px(800))
tap(sw('locked', 'for a year', 0.2), 0.01, px(1465))
knock(sw('locked', 'not even an admin', 0.2), 0.011, px(1070), 280)
P_off = sw('off', 'Switching a record off')
tap(P_off, 0.01, px(462)); bell(P_off + 0.3, 0.015, px(800))
bell(sw('off', 'goes quiet', 0.2), 0.015, px(800))
mark(sw('names', 'their own name'), 0.62)
knock(sw('names', 'agents too', -0.2), 0.01, px(1465), 260)
tap(sw('people', 'read by few', 0.2), 0.009, px(1740))
P_pl = sc_('pilots', -0.3)
bow(38, P_pl + 0.3, P_pl + 3.6, 0.55)
paper(sc_('pilots', 0.2), 0.011, px(440))
P_rd = sc_('read', 0.2)
paper(P_rd, 0.012, px(960))
plates((53, 57, 60), P_rd + 0.1, 0.55, spread=0.14)
bow(41, P_rd + 0.2, P_rd + 3.8, 0.5)

# 5. A bell for great power. The first bell; "someone always answers": C and F. One morning, the bad load: the bass's D. The switch-on
#    page and its fields; "Sam approves": the switch, and F, C and A. The platform team's bell; the card; it matches a known task, a
#    tick. The record keeps the rest: three rows set down. The other bells, each as it rings. "Few bells": A and D, softly
ew_ = lambda lid, word, off=0: W('bell', lid, word, off)
ec_ = lambda lid, off=0: G('bell', lid, off)
bell(ew_('bells', 'ring a bell', 0.1), 0.016, px(960))
plates((60, 65), ew_('bells', 'always answers', 0.1), 0.5)
P_wr = ew_('morning', 'gone wrong')
paper(P_wr, 0.011, px(700))
bow(38, P_wr + 0.1, P_wr + 3.3, 0.55)
paper(ec_('switches', -0.2), 0.012, px(1270))
tap(ew_('switches', 'for an hour'), 0.008, px(1000)); tap(ew_('switches', 'with a reason'), 0.008, px(1460))
P_ap = ew_('switches', 'Sam approves')
tap(P_ap, 0.011, px(800))
plates((53, 60, 69), P_ap + 0.2, 0.55, spread=0.12)
bell(ec_('alert', 0.2), 0.015, px(420))
paper(ec_('alert', 0.3), 0.011, px(1230))
tap(ew_('alert', 'known task', 0.2), 0.009, px(1100))
for word in ('the switch-on', 'the restore', 'the switch-off'):
    knock(ew_('rest', word), 0.01, px(960), 250)
for word, x in (('risky sign-in', 760), ('emergency account', 1160), ('gone quiet', 1560)):
    bell(ew_('others', word), 0.012, px(x))
bell(ec_('others'), 0.012, px(360))
plates((57, 62), ec_('few', 0.6), 0.5)

# 6. The night a session was copied. The bell for a risky sign-in; the pulse, the bass's open strings plucked, until "another
#    country" has been said. Jun at home, no music; the add-on changes hands: the bass's B flat; the copy comes out from under his
#    session and is carried off on a breath of air; "Whoever holds it is Jun". The first step: the pulse again, the sessions ended one
#    by one, a stamp each; it stops with the last. Twelve minutes: the clock turns green, a tick, and A and F; GitHub and the platform
#    refuse it: the copy struck through
nw = lambda lid, word, off=0: W('night', lid, word, off)
nc = lambda lid, off=0: G('night', lid, off)
P_bl = nw('evening', 'the bell rings')
bell(P_bl + 0.1, 0.016, px(960))
throb(P_bl + 0.7, nc('session', 2.8), g=0.8)
paper(nw('session', 'another country', -0.2), 0.012, px(960))
P_hd = nw('addon', 'changed hands')
paper(nc('addon'), 0.011, px(1460))
bow(34, P_hd, P_hd + 3.2, 0.55)
air(nw('addon', 'copied his sign-ins'), 2.4, 0.008, px(1500))
paper(nw('whoever', 'Whoever', -0.4), 0.011, px(1460))
throb(nc('ends', 0.0), nw('ends', 'on the platform', 0.7), g=0.8)
for word in ('in the directory', 'in GitHub', 'on the platform'):
    knock(nw('ends', word), 0.012, px(1700), 230)
P_tw = nw('refuse', 'Twelve minutes')
tap(P_tw + 0.4, 0.01, px(1500))
plates((57, 65), P_tw + 0.5, 0.55)
strike(nw('refuse', 'refuse it'), 0.009, px(1100))

# 7. What the record showed. The store: F and C. The download, a row set down; "No push", "no change to a rule", "no approval", a quiet
#    tap each; no door; the code: no secret, no learner's data, F, A and C. The add-on taken off every browser, a breath of air; the
#    morning: the bass's F, and C; the clean laptop. The review without blame, its two new rules laid on; the review's last tick: the
#    mark. A leaked secret: the bass's D, short, and the token struck through
ow = lambda lid, word, off=0: W('showed', lid, word, off)
oc = lambda lid, off=0: G('showed', lid, off)
plates((53, 60), oc('read', 0.2), 0.5, pan=(0.0, 0.3))
knock(ow('download', 'downloaded'), 0.011, px(1300), 250)
for t_ in (oc('nopush'), ow('nopush', 'no change to a rule'), ow('nopush', 'no approval')):
    tap(t_, 0.008, px(1300))
tap(ow('platform', 'no door', -0.6), 0.008, px(1300))
P_nl = ow('code', "no learner's data", -0.6)
plates((53, 57, 60), P_nl, 0.5, spread=0.16)
air(ow('wiped', 'taken off'), 1.2, 0.007, px(1000))
P_mo = ow('wiped', 'next morning')
bow(41, P_mo, P_mo + 3.4, 0.5)
lujon(60, P_mo + 0.4, 0.45, px(1560))
knock(ow('wiped', 'clean laptop', -0.2), 0.01, px(1100), 260)
paper(oc('review'), 0.012, px(1320))
paper(ow('now', 'browsers take'), 0.011, px(1320)); paper(ow('now', 'GitHub takes'), 0.011, px(1320))
mark(ow('now', 'GitHub takes', 1.2), 0.58)
P_sc = oc('secret', -0.3)
bow(38, P_sc + 0.4, P_sc + 2.6, 0.5)
strike(ow('secret', 'end it first', 0.3), 0.009, px(1130))

# 8. The glass to break. Two admins, each switched on and approved: D and A; a tick each. What if: the sign-in service, a card laid on;
#    a wrong rule: the bass falls from B flat to A as every admin is locked out. Two emergency accounts behind glass: F major, four
#    plates, the bass's F; the two safes set down; any sign-in rings every bell. The test: a safe's door; the key glows, one plate; the
#    door closes, the key against it; the bells, and everyone knows it's the test
gw = lambda lid, word, off=0: W('glass', lid, word, off)
gc = lambda lid, off=0: G('glass', lid, off)
plates((50, 57), S0('glass') + 0.4, 0.5, pan=(-0.5, -0.3))
for i in range(2):
    tap(gw('approved', 'someone else', 0.6 + 0.2 * i), 0.008, px(600))
paper(gc('whatif'), 0.011, px(1420))
P_rl = gw('whatif', 'a wrong rule')
paper(P_rl, 0.011, px(1420))
bow(34, P_rl + 0.3, P_rl + 2.3, 0.55)
bow(33, P_rl + 2.4, P_rl + 4.6, 0.55)
P_two = gc('two')
plates((53, 57, 60, 65), P_two + 0.2, 0.58, spread=0.12)
bow(41, P_two + 0.3, P_two + 3.5, 0.5)
for i in range(2):
    knock(gw('keys', 'two safes', 0.3 * i), 0.01, px((470, 1290)[i]), 200)
bell(gw('rules', 'rings every bell'), 0.014, px(960))
P_op = gw('test', 'open a safe')
knock(P_op, 0.011, px(470), 170)
lujon(57, gw('test', 'check it works'), 0.45, px(560))
P_lk = gw('test', 'lock the key away')
knock(P_lk + 0.3, 0.011, px(470), 170); clink(P_lk + 0.35, 0.006, px(560))
bell(gc('rings', 0.2), 0.013, px(960))

# 9. A copy nobody can delete. The table and its history: D and F. Found too late, a knock; the table deleted: a breath of air and the
#    bass's D. Every night at two: the clock; a copy carried across; four dated copies set down; locked for 30 days, a lock. Not even an
#    admin: a knock. Once a month, restored beside the real table; they match: a tick, and F major, the bass's F under it
cw = lambda lid, word, off=0: W('copy', lid, word, off)
cc = lambda lid, off=0: G('copy', lid, off)
plates((50, 53), S0('copy') + 0.4, 0.5, pan=(-0.5, -0.3))
knock(cw('late', 'found too late'), 0.01, px(560), 300)
P_dl = cw('late', 'deletes a table')
air(P_dl, 1.0, 0.007, px(320))
bow(38, P_dl + 0.1, P_dl + 3.0, 0.5)
tap(cc('nightly'), 0.009, px(700))
P_ap2 = cw('nightly', 'a place apart')
air(P_ap2 - 0.6, 1.4, 0.007, px(900))
for i in range(4):
    knock(P_ap2 + 0.3 + 0.35 * i, 0.008, px(1490), 260)
tap(cc('thirty', 0.1), 0.009, px(1700))
knock(cw('thirty', 'not even an admin', 0.3), 0.01, px(1100), 300)
paper(cw('monthly', 'beside the real table'), 0.011, px(850))
P_mt = cw('monthly', 'they match')
tap(P_mt, 0.01, px(575))
plates((60, 65, 69), P_mt + 0.1, 0.55, spread=0.12)
bow(41, P_mt + 0.2, P_mt + 3.2, 0.5)
paper(cw('hope', 'only a hope', -0.6), 0.011, px(610))

# 10. Seen. Three months on: F and C. All from one place, a slip laid on. The review's answers, the bass under each: F, then B flat,
#     then C. The job's badge; its ninety nights fill in, one soft texture. Warren's box at dawn: F, C and F. The record does the same for
#     the platform: a tick each, softly. The last line: the mark; the end card: F major, the bass's F held to the end
uw = lambda lid, word, off=0: W('seen', lid, word, off)
uc = lambda lid, off=0: G('seen', lid, off)
plates((53, 60), S0('seen') + 0.5, 0.5, pan=(-0.3, 0.0))
paper(uw('afternoon', 'one place'), 0.011, px(900))
P_a1 = uw('signins', 'one was wrong')
bow(41, P_a1, P_a1 + 3.0, 0.5)
P_a2 = uw('power', 'each with a reason', -0.4)
bow(34, P_a2, P_a2 + 3.0, 0.5)
P_a3 = uw('production', 'each change reviewed', -0.4)
bow(36, P_a3, P_a3 + 3.0, 0.5)
paper(uc('job', 0.0), 0.011, px(460))
spool(uw('job', 'every night at two'), 3.2, 0.005, px(1320))
P_dw = uc('box', -0.3)
plates((53, 60, 65), P_dw + 0.4, 0.55, spread=0.2)
paper(uc('guess', 0.3), 0.011, px(960))
for i in range(5):
    tap(uw('same', 'for the platform', 0.15 * i), 0.007, px((740, 1060, 900, 640, 1160)[i]))
mark(uc('see', 0.3), 0.62)
P_end = uc('breath')
plates((41, 53, 57, 60, 65), P_end + 0.4, 0.62, spread=0.1)
bow(41, P_end + 0.5, E('seen') - 0.5, 0.5)
