# A person asks: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A new
# palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's other films
# (/mnt/project-files/data-protection/palettes.md, where this film's thread took it): a muselar virginal and a basset horn, both made
# here (music.py has neither).
#  - The muselar virginal, the household keyboard of the 1600s, its strings plucked at their middle, so each note is round and hollow:
#    odd harmonics only, nothing like the site's harpsichord. Played softly, each note plucked once and left to ring: each record found
#    is one note. London in 1676 and Westminster in 1679 are its home; in the university it sounds where something is found or set down.
#  - The basset horn, kept low in its basset notes, below any clarinet's range: one voice, no vibrato, the odd harmonics of a
#    cylindrical bore and a faint breath. The answer: held only where a person is answered, decides or keeps something (a judge who
#    refuses, the Act, the copy written for Linh, the owners who check, Ingrid's no, the answer on 7 December).
#  - G minor for the summer of 1676 and for a request left waiting; B-flat major for the Act and for the copy; G major where a request
#    is answered on time, with proof, and for the title and the end. E-flat major as a door opens; D major for the writ's new world.
#    Every chord is tuned pure (just intonation from G, see hz()): G minor and major, B-flat major, E-flat major, C minor, D major and
#    D minor are all pure in this table; F with C and A with E are not, so neither sounds.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story (chapters 1 and 2), and after it only at a chapter's turn, under a moment on
#    screen or in a pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato, and no urgent pulse (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (thirty marks of a clock, rows
#    typed) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1679)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (43, 98.0)  # G 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
G2, A2, Bb2, B2, C3, D3, Eb3, E3, F3, Fs3 = 43, 45, 46, 47, 48, 50, 51, 52, 53, 54
G3, A3, Bb3, B3, C4, D4, Eb4, F4, Fs4, G4, A4, Bb4, B4, D5 = 55, 57, 58, 59, 60, 62, 63, 65, 66, 67, 69, 70, 71, 74

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the basset horn a little under the virginal; the effects about
# 16 dB under the music (FX scales them all)
VL, BL, FX = 0.074, 0.042, 1.4

# a room round the players: a small, panelled room, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level in it (_held), as the
# video guidelines ask
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

# ---- the muselar virginal: a string plucked at its middle sounds only its odd harmonics, each weaker by the square of its number, so the
# note is round and hollow; the higher ones die sooner. The quill's touch: a small, soft tick with its top rolled off. Plucked once and
# left to ring, the low strings longest; nothing trembles
def virginal(m, s, g=1.0, pan=0.0, ring=None, room=0.3):
    f = hz(m); ring = ring or (1.5 if f < 160 else 1.2 if f < 330 else 0.95)
    sec = min(4.5, ring * 2.8); x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for k in range(1, 30, 2):
        fk = f * k
        if fk > 2300:
            break
        a = (1.0 if k == 1 else 1.5) / k ** 2
        sig = sig + (-1) ** ((k - 1) // 2) * a * np.sin(2 * np.pi * fk * x) * np.exp(-x * (1 + 0.45 * (k - 1)) / ring)
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    nt = int(0.025 * SR); tk = filt(noise(0.025)[:nt], 'band', (600, 1800)) * np.exp(-np.arange(nt) / SR / 0.0035) * 0.05
    sig[:nt] += tk
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.12) / 0.12, 0, 1)) ** 2
    put(_held(filt((sig / max(1e-9, float(np.abs(sig).max()))).astype(np.float32), 'low', 2300), room), s, g * VL, pan)
def roll(notes, s, step=0.11, g=1.0, pan=0.0, ring=None, spread=0.25):
    """strings plucked one after another, the lowest first, ringing on together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        virginal(m, s + step * i, g * (1.0 if i == 0 else 0.82) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5), ring)

# ---- the basset horn, low in its basset notes: a cylindrical bore, so the odd harmonics sound and the even ones only faintly; dark,
# with nothing above 1.8 kHz at this level. The higher harmonics speak a moment after the first; a faint breath as the note starts.
# Held steady, with no vibrato; a note of 1.2 s or more swells a little and eases, once
def basset(m, a, b, g=1.0, att=0.16, rel=0.5, pan=-0.1, room=0.3):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(1800 // f) + 1):
        fk = f * k
        w = (1.0 if k % 2 else 0.16) / k ** 0.75 * np.exp(-max(0.0, fk - 650) / 450)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.5 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.29 * k)
    if sec >= 1.2:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (250, 1200)) * 0.005 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 1.5 * np.exp(-x / 0.05))
    put(_held(filt((s + br).astype(np.float32), 'low', 1800), room), a, g * BL, pan)
def answer(s, g=1.0, hold=1.6, pan=-0.1, lo=D3, hi=G3):
    """a person is answered, or decides: the basset horn's rising fourth"""
    basset(lo, s, s + 0.45, g * 0.9, att=0.12, rel=0.25, pan=pan); basset(hi, s + 0.5, s + 0.5 + hold, g, att=0.14, rel=0.8, pan=pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card or a page set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a box ticked, a row lit"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.007, pan=0.0, step=0.14):
    """a few keys typed, never a burst"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet laid down, or drawn out"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def strike(s, g=0.008, pan=0.0, sec=0.4):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def wax(s, g=0.016, pan=0.0):
    """a seal pressed into wax: a low, soft knock and the press"""
    s_knock(s, g * FX, pan, 150); x = tt(0.12); X(filt(noise(0.12), 'band', (180, 900))[:len(x)] * np.exp(-x / 0.03), s + 0.01, g * 0.4 * FX, pan)
def coins(s, g=0.010, pan=0.0):
    """a leather purse set on the table: its soft thud, and the coins settling inside, muffled"""
    s_knock(s, g * FX, pan, 180)
    for i, d in enumerate((0.03, 0.09, 0.16)):
        x = tt(0.05); X(filt(noise(0.05), 'band', (700, 2000))[:len(x)] * np.exp(-x / 0.008), s + d, g * (0.30 - 0.07 * i) * FX, pan)
def door(s, sec=1.6, g=0.010, pan=0.0):
    """a heavy door or gate opening: a low, slow brush of wood and its hinge, under 1 kHz"""
    x = tt(sec); X(filt(noise(sec), 'band', (90, 700))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)
    s_knock(s + sec * 0.9, g * 0.5 * FX, pan, 130)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, or the marks of a clock drawn round"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.011, pan=0.0):
    """a job starts: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)

# =============================================================================================================================
# 1. Held through the summer (the opening, with music all through it). London at evening: G minor on the virginal, the basset horn's low
#    G under it. Jenkes at the Guildhall: a note for him, and B-flat major as he asks for a new Parliament. The Council's warrant: its
#    seal pressed, C minor; it names no day: one note, E-flat, left open. The copy asked for: a page; promised and stalled: two notes
#    falling. Bail: the purse set down and taken back; refused: the low G. The writ: have the body, an open fifth. The plea slides under
#    the door and comes back; the judge refuses (a person decides): the basset horn on G. August: his letter, and the days going by, a
#    note for each day's light, falling; something had to change: the basset horn's D, which leads to the Act
S = lambda lid, word, off=0: W('summer', lid, word, off)
s0 = S0('summer')
roll((G2, D3, G3, Bb3), s0 + 0.6, 0.16, 0.8, ring=1.8)
basset(G2, s0 + 0.9, S('guildhall', 'At the Guildhall', 0.2), 0.75, att=1.4, rel=1.4)
virginal(D4, S('jenkes', 'Francis', 0.2), 0.5, px(760))
knock(S('jenkes', 'Francis', 0.2), 0.010, px(760), 260)
roll((Bb2, F3, Bb3, D4), S('guildhall', 'new Parliament', -0.1), 0.13, 0.65, ring=1.5)
# the Gatehouse: the warrant, its seal; it names no day
paper(S('council', 'kept', -0.4), 0.010, px(300), 0.45)
wax(S('council', 'kept', 0.45), 0.016, px(480))
roll((C3, G3, Eb4), S('council', 'kept', 0.5), 0.14, 0.55, ring=1.6)
virginal(Eb4, S('noday', 'names', 0.05), 0.45, px(240), ring=1.4)
# the copy, promised and not given; bail offered and refused
knock(S('copy', 'copy of the warrant', -0.2), 0.012, px(940), 240)
virginal(D4, S('stalls', 'promises', 0.0), 0.42, px(860)); virginal(Bb3, S('stalls', 'stalls', 0.05), 0.42, px(860))
coins(S('bail', 'bail', 0.05), 0.010, px(820))
coins(S('refused', 'Refused', 0.15), 0.008, px(820))
virginal(G2, S('refused', 'Refused', 0.0), 0.5, px(960), ring=1.6)
# the writ: have the body, bring him and say why
knock(S('writ', 'habeas corpus', -0.1), 0.012, px(450), 240)
virginal(G3, S('latin', 'have the body', 0.0), 0.45, px(450)); virginal(D4, S('latin', 'have the body', 0.45), 0.45, px(450))
# the plea under the door, and back; the judge refuses: the basset horn on G, G minor
paper(S('holiday', 'refuses', 0.1), 0.009, px(900), 0.6); paper(S('holiday', 'refuses', 1.6), 0.008, px(900), 0.5)
basset(G2, S('holiday', 'refuses', 0.2), S('holiday', 'summer holiday', 1.2), 0.7, att=0.5, rel=1.0)
roll((G2, Bb2, D3), S('holiday', 'summer holiday', 0.0), 0.14, 0.5, ring=1.6)
# August: his letter; the days going by, a note for each day's light; something had to change
paper(S('august', 'August', -0.3), 0.009, px(520), 0.4)
virginal(Bb3, S('august', 'great loss', 0.0), 0.42, px(1000), ring=1.4)
tM = S('months', 'months')
for i, m in enumerate((F4, D4, Bb3)):
    virginal(m, tM + 0.75 + 1.5 * i, 0.32, px(1180 - 230 * i), ring=1.0)
basset(D3, S('change', 'A prisoner', -0.1), E('summer') + 0.3, 0.7, att=0.6, rel=1.2)

# 2. Three days (the opening goes on). The Act unrolled: B-flat major, its seal, the basset horn's B-flat (Parliament decides). Three
#    days, ten, twenty: a note each, rising; the true causes certified: the basset horn's fourth. The door opens: E-flat major. The
#    copy within six hours: a page, its tick; a keeper who stalls pays: the purse, twice. The gate opens: B-flat major. A century
#    later: D major. Today: the question, an open fifth on G; left in an inbox: G minor, the basset horn low. Given a clock: its marks
#    drawn round, one breath of air; the true reasons, proof, on time: G major, rising. The title card: G major, and the low G
D = lambda lid, word, off=0: W('days', lid, word, off)
d0 = S0('days')
paper(G('days', 'act', 0.2), 0.010, px(640), 0.9)
roll((Bb2, F3, Bb3, D4), D('act', 'Habeas Corpus Act', 0.0), 0.15, 0.75, ring=1.8)
basset(Bb2, D('act', 'Habeas Corpus Act', 0.1), D('three', 'Once', 0.2), 0.7, att=0.8, rel=1.1)
virginal(D4, D('three', 'three days', 0.0), 0.42, px(1300)); virginal(F4, D('far', 'Ten days', 0.0), 0.4, px(1300))
virginal(Bb4, D('far', 'twenty if', 0.0), 0.36, px(1300))
answer(D('three', 'certify', 0.0), 0.7, hold=1.4, pan=px(1460), lo=F3, hi=Bb3)
door(G('days', 'anyjudge', 0.0), 1.6, 0.010, px(1280))
roll((Eb3, Bb3, Eb4, G4), D('anyjudge', 'any judge', 0.0), 0.13, 0.55, ring=1.5)
knock(G('days', 'sixhours', -0.1), 0.012, px(840), 240)
tap(D('sixhours', 'six hours', -0.2), 0.009, px(1070))
coins(D('pays', 'hundred pounds', -0.4), 0.010, px(860))
coins(D('second', 'two hundred', -0.4), 0.010, px(1120))
door(G('days', 'learns', 0.0), 1.8, 0.011, px(960))
roll((Bb2, D3, F3, Bb3), D('learns', 'within days', 0.0), 0.14, 0.6, ring=1.6)
paper(G('days', 'century', -0.1), 0.010, px(960), 0.6)
roll((D3, Fs3, A3, D4), D('century', 'United States', 0.0), 0.14, 0.5, ring=1.5)
# today
virginal(G3, D('today', 'what do you hold', -0.2), 0.45, px(960)); virginal(D4, D('today', 'what do you hold', 0.25), 0.42, px(960))
air(D('inbox', 'waits', -0.5), 1.1, 0.008, px(960), 150, 800)
basset(G2, D('inbox', 'waits', -0.3), END('days', 'inbox') + 0.4, 0.65, att=0.6, rel=1.0)
roll((G2, Bb2, D3), D('inbox', 'nobody', 0.0), 0.15, 0.45, ring=1.5)
air(D('trusted', 'clock', 0.0), 1.4, 0.009, px(960), 200, 1000)
for i, (w_, m) in enumerate((('true reasons', G3), ('proof', B3), ('on time', D4))):
    virginal(m, D('trusted', w_, 0.0), 0.45, px((600, 890, 1050)[i] + 100))
# the title card
tT = G('days', 'breath', 0.3)
roll((G2, D3, G3, B3, D4), tT, 0.16, 0.8, ring=2.0)
basset(G2, tT + 0.1, E('days') + 0.2, 0.65, att=1.0, rel=1.4)

# 3. A request with a clock (from here, music only now and then). Linh writes: keys, a few. The request logged: a card; its clock, the
#    thirty marks drawn round as one breath of air, and B-flat major as on the Act. Ingrid takes HR's part (she keeps it): the basset
#    horn's D. The ticket: a page; its steps typed, a few keys. Her numbers' one place: a lock, and two low notes
C = lambda lid, word, off=0: W('clock', lid, word, off)
virginal(D4, G('clock', 'writes', 0.1), 0.4, px(960))
keys(G('clock', 'asks', 0.2), 4, 0.006, px(1400), 0.4)
knock(G('clock', 'logs', 0.3), 0.012, px(780), 240)
air(C('due', 'clock', 0.0), 1.6, 0.008, px(780), 200, 1000)
roll((Bb2, F3, Bb3, D4), C('due', 'thirty days', 0.0), 0.13, 0.5, ring=1.4)
basset(D3, C('ingrid', 'Ingrid', -0.2), C('ingrid', "HR's part", 1.0), 0.6, att=0.4, rel=0.9, pan=px(1520))
paper(G('clock', 'ticket', -0.3), 0.010, px(960), 0.4)
keys(C('ticket', 'ticket', 0.6), 3, 0.006, px(960), 0.4)
lock(C('oneplace', 'one place', 0.1), 0.010, px(990))
virginal(G2, C('oneplace', 'one place', 0.1), 0.45, px(1240), ring=1.6); virginal(D3, C('oneplace', 'privacy office', 0.0), 0.42, px(1700), ring=1.4)

# 4. Every place she is. Mei keeps the master record: a card. Her six numbers land in the table of keys: a note for each record found,
#    rising (G, A, B, D, G, B). dbt lists more than thirty: a few keys, and one note. Lineage adds the rest: a tap each. The tags: two taps.
#    The job, as itself: a click. Table by table, each table found a note (D, F sharp, A, D, F sharp: D major); the marts, only a code:
#    the low B-flat; a search for her numbers would miss them: one knock; the codes found: four notes rising on G major. Never typed:
#    a page; each query joins the keys: a lock. Outside the platform, each owner searches their own: a tap each
P = lambda lid, word, off=0: W('places', lid, word, off)
knock(P('master', 'master record', -0.3), 0.012, px(730), 240)
tL = P('six', 'six in all', -0.8)
for i, m in enumerate((G3, A3, B3, D4, G4, B4)):
    virginal(m, tL + 0.25 * i, 0.4, px(1170), ring=0.9)
keys(P('dbt', 'dbt', 0.0), 4, 0.006, px(1260), 0.5)
virginal(B3, P('dbt', 'more than thirty', 0.0), 0.42, px(900))
for w_ in ("notebook's", 'dashboard', "another team's job"):
    tap(P('lineage', w_, -0.1), 0.007, px(1500))
for w_ in ('names a person', 'code for one'):
    tap(P('tags', w_, 0.0), 0.007, px(1640))
click(P('job', 'job', 0.25), 0.011, px(320))
tTb = P('looks', 'Table by table', 0.4)
for i, m in enumerate((D3, Fs3, A3, D4, Fs4)):
    virginal(m, tTb + 0.45 * i, 0.36, px(1070), ring=0.9)
virginal(Bb2, P('marts', 'marts', 0.2), 0.42, px(1300), ring=1.4)
knock(P('miss', 'miss', 0.1), 0.010, px(1070), 200)
tMs = P('miss', 'miss', 1.6)
for i, m in enumerate((B3, D4, G4, B4)):
    virginal(m, tMs + 0.25 * i, 0.34, px(1070), ring=0.9)
paper(G('places', 'typed', 0.2), 0.009, px(960), 0.4)
lock(P('joins', 'joins', -0.2), 0.010, px(960))
tLin = P('owners', 'Lineage only', 0.6)
for i in range(4):
    knock(tLin + 0.35 * i, 0.008, px((285, 285, 1635, 1635)[i]), 230)
for i in range(4):
    tap(P('owners', 'search their own', 0.3 * i), 0.007, px((285, 285, 1635, 1635)[i]))

# 5. What we hold about you. Not a pile of tables: they fold away; the copy written for her rises: B-flat major, and the basset horn
#    answers (a person is answered). Each part's row set down: a soft knock. The true causes: a page. Other people's marks struck
#    through. The owners check their parts on 3 December: the basset horn, one note for each (D, G, B), each a person who decides
q0 = S0('copy')
paper(W('copy', 'pile', 'pile', -0.3), 0.010, px(840), 0.5)
tWr = W('copy', 'written', 'written', 0.0)
roll((Bb2, F3, Bb3, D4), tWr, 0.14, 0.6, ring=1.6)
answer(tWr + 0.3, 0.7, hold=1.6, pan=0.0, lo=F3, hi=Bb3)
for lid, w_ in (('contract', 'A contract'), ('law', 'A law'), ('task', 'public task'), ('research', 'research')):
    knock(W('copy', lid, w_, -0.1), 0.009, px(400), 250)
paper(W('copy', 'causes', 'true causes', 0.0), 0.008, px(380), 0.35)
strike(W('copy', 'others', 'marks', 0.2), 0.008, px(260), 0.8)
tCk = W('copy', 'check', 'Ingrid', -0.2)
basset(D3, tCk, W('copy', 'check', 'Mei', -0.25), 0.6, att=0.25, rel=0.3, pan=px(340))
basset(G3, W('copy', 'check', 'Mei', -0.2), W('copy', 'check', 'research office', -0.25), 0.62, att=0.2, rel=0.3, pan=px(940))
basset(B3, W('copy', 'check', 'research office', -0.2), END('copy', 'check') + 0.6, 0.6, att=0.2, rel=1.0, pan=px(1540))
for w_ in ('Ingrid', 'Mei', 'research office'):
    tap(W('copy', 'check', w_, 0.3), 0.008, px(960))

# 6. Taken off, and kept off. At night, the deletion job: its click; her row struck and drawn out of the list's table and its log; the
#    mailing tool drops her: struck. That morning, Ingrid puts her no on the person (a person decides): the basset horn's falling
#    fourth, G to D, as the yes turns to no. The rule: a page; the next rebuild leaves her out: one knock. The old versions: a note as
#    they open, and, cleaned up on 2 December, two notes falling as they go. Deleting the row alone: her yes, and G minor, low
O = lambda lid, word, off=0: W('off', lid, word, off)
virginal(Eb4, G('off', 'first', 0.2), 0.38, px(960), ring=1.3)
click(O('night', 'deletion job', -0.3), 0.011, px(1140))
strike(O('night', "list's table", 0.0), 0.008, px(440), 0.6); paper(O('night', "list's table", 0.8), 0.008, px(440), 0.5)
strike(O('night', 'its log', 0.0), 0.008, px(440), 0.6); paper(O('night', 'its log', 0.8), 0.008, px(440), 0.5)
strike(O('sync', 'sync', 0.0), 0.008, px(1660), 0.5)
paper(O('morning', 'her no', -0.1), 0.008, px(1400), 0.4)
basset(G3, O('morning', 'her no', -0.2), O('morning', 'her no', 0.45), 0.6, att=0.15, rel=0.25, pan=px(1400))
basset(D3, O('morning', 'her no', 0.5), O('morning', 'her no', 2.2), 0.62, att=0.15, rel=0.9, pan=px(1400))
paper(O('rebuilt', 'rebuilt', -0.2), 0.009, px(490), 0.4)
knock(O('leaves', 'leaves her out', 0.7), 0.010, px(1110), 200)
paper(O('versions', 'old versions', -0.2), 0.009, px(480), 0.5)
air(O('versions', 'seven days', 0.0), 1.0, 0.007, px(1300), 200, 1000)
tGo = O('versions', 'second of December', 0.0)
virginal(D4, tGo + 0.1, 0.38, px(560), ring=1.0); virginal(G3, tGo + 0.9, 0.38, px(560), ring=1.3)
paper(O('alone', 'yes still there', -0.2), 0.008, px(1540), 0.4)
roll((G2, D3, Bb3), O('alone', 'brought her back', 0.0), 0.16, 0.42, ring=1.6)

# 7. Proof, on time. Each box ticked: a tap, as each is; the run, the history and the audit log: a page each. The table of requests:
#    a page; a request near its date: one note, E-flat, its ring. Linh's answer ready, seventeen days early, and opened: she is
#    answered: B-flat major and the basset horn's fourth. The ticket closes: a knock; her numbers, lit where they stay in the table of keys: a
#    tap; kept until the last locked copy is gone: a sheet laid down. 1679: the keeper answered with the body, the true causes, within days: the Act's note, the basset horn on B-flat. Here: G
#    major, a note for each of the three things, and the low G
F = lambda lid, word, off=0: W('proof', lid, word, off)
for t_ in (F('ticked', 'ticked', 0.3), END('proof', 'run') + 0.2, F('history', 'history', 0.2), END('proof', 'audit') + 0.2):
    tap(t_, 0.008, px(80))
paper(F('history', 'history', -0.1), 0.009, px(1470), 0.4)
paper(F('audit', 'audit log', -0.1), 0.009, px(1470), 0.4)
paper(G('proof', 'table', -0.1), 0.009, px(960), 0.4)
virginal(Eb4, F('near', 'near its date', 0.0), 0.4, px(1340), ring=1.4)
knock(F('late', 'late answer', 0.0), 0.009, px(720), 230)
tRd = F('ready', 'she opens', 0.0)
roll((Bb2, F3, Bb3, D4), F('ready', 'seventeen days early', 0.0), 0.13, 0.5, ring=1.5)
answer(F('ready', 'signing in', 0.3), 0.72, hold=1.5, pan=px(900), lo=F3, hi=Bb3)
tap(G('proof', 'closes', 0.2), 0.008, px(80))
knock(F('closes', 'closes', -0.1), 0.010, px(520), 230)
tap(F('closes', 'Her numbers', 0.4), 0.007, px(1180))
paper(F('closes', 'until the last locked copy', -0.1), 0.008, px(520), 0.4)
basset(Bb2, F('n1679', 'the body', -0.2), F('n1679', 'within days', 1.2), 0.62, att=0.6, rel=1.0)
virginal(Bb3, F('n1679', 'true causes', 0.0), 0.4, px(1300))
for w_, m in (("what's held", G3), ('true reasons', B3), ('on time', D4)):
    virginal(m, F('here', w_, 0.0), 0.44, px(960))
basset(G2, F('here', "what's held", 0.1), END('proof', 'here') + 1.2, 0.62, att=0.8, rel=1.2)

# 8. Kept for a reason. Five films, one person's data: a note for each as it comes in, rising; each lesson written as it's said, with
#    no music under the voice. The module's three series: E-flat major as they stand together. Next, AI agents in data work: a rising
#    fourth. The end card: G major, and the basset horn's low G
K = lambda lid, word, off=0: W('reason', lid, word, off)
tFv = K('five', 'Five films', -0.2)
for i, m in enumerate((Bb2, D3, F3, Bb3, D4)):
    virginal(m, tFv + 0.2 * i, 0.38, px(960), ring=1.0)
for lid in ('say', 'end', 'ask', 'gone', 'time'):
    tap(G('reason', lid, 0.1), 0.006, px(1200))
roll((Eb3, G3, Bb3, Eb4), K('module', 'data protection', 0.0), 0.14, 0.5, ring=1.5)
virginal(D4, K('next', 'AI agents', 0.0), 0.4, px(1300)); virginal(G4, K('next', 'AI agents', 0.5), 0.4, px(1300))
tEnd = G('reason', 'breath', 0.6)
roll((G2, D3, G3, B3, D4), tEnd, 0.17, 0.8, ring=2.0)
basset(G2, tEnd + 0.1, E('reason') + 0.4, 0.6, att=1.0, rel=1.6)
