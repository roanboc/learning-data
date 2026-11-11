# Read often, kept close: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette (/mnt/project-files/modern-data-basics/palettes.md, where the module's setup thread reserved the lead for this film on
# 5 November 2026, and this film's thread chose the partner): a pyrophone, made here (music.py has none), and its own low tubes.
#  - The pyrophone, the fire organ of the 1870s: glass tubes made to sing by a flame burning inside them. A tube sounds while it's hot
#    and falls silent as it cools, which is this film's idea: where data lives follows how often it's read. Played plain and steady, no
#    flicker: a tube's note swells in slowly as its air heats (no click, no chiff, nothing like a flute's breath at the start), holds at
#    an even level, and fades as it cools. Its tone: the tube's harmonics, falling off fast, a narrow breath of air round the note, and
#    under it the soft, even hush of the flame at the tube's foot, which keeps it apart from the site's organs, flutes and glass
#    harmonica. The high tubes, E 4 to E 5, carry the tune.
#  - The partner: the pyrophone's own low tubes, E 2 to B 3, rounder and slower to heat, rather than a second colour, as film 4 chose
#    a second ophicleide and film 6 the repeater's own low gong: every colour the site lacks either belongs to another culture or sounds
#    like one the site has. They hold the ground under the opening, and sound under a chapter's turn.
#  - The mark: a note that sounds while its tube is hot, softer as it cools, and silent when cold: one high tube, lit, held, then
#    cooling to nothing. At minus eighteen degrees, at the copies frozen far away, the title, the archive tier, one record moving down,
#    and the end card.
#  - E major for the data kept as it's used, and for what got better; C sharp minor for the problem (the bank lost, the tutors paid
#    late, the records kept in the costliest storage and never deleted). Just intonation from E (hz()), so E, A and B major and
#    C sharp and G sharp minor are pure; F sharp minor would beat, so no chord holds F sharp with A.
#  - Storage tiers, three tubes and the mark: the hot tier is the high E, cool the B under it, cold the E an octave down, and the
#    archive the mark, each sounded alone, where a tier is named or a file moves.
# The rules every film keeps (AGENTS.md, Sound; the module's palettes.md):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words, at most about
#    once every 10 seconds; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord tuned pure. No urgent pulse: the tutors paid
#    late are told calmly (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at its moment: each uses the same word and offset as the picture in src/scenes.js, so sound and
#    picture stay together when the voice is re-timed. Effects one at a time, soft, below about 2.5 kHz.

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
R1 = np.random.default_rng(1873)  # this film's own randomness: the flames, the air

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (40, 82.407)  # E 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Cs2, E2, A2, B2, Cs3, E3, Gs3, A3, B3 = 37, 40, 45, 47, 49, 52, 56, 57, 59                  # the low tubes
Cs4, E4, Fs4, Gs4, A4, B4, Cs5, Ds5, E5 = 61, 64, 66, 68, 69, 71, 73, 75, 76                # the high tubes
HOT, WARM, COLD = E5, B4, E4                                                              # three temperatures, three tubes

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films'; the low tubes a little under the high ones; the effects far under the music (FX scales them all)
TL, PL, FX = 0.060, 0.052, 1.4

# a room round the instrument: a salon, as the pyrophone was played in, ringing on for about a second, nothing much above 1.8 kHz. Its
# level is set by what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own
# level (_held), as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
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

# ---- the pyrophone: a glass tube's note, swelling in as the flame heats its air, even while it holds, fading as it cools
def _flame(n, lo, hi):
    """the hush of a gas flame burning steadily at a tube's foot: soft, low, even; no flicker"""
    return filt(R1.standard_normal(n).astype(np.float32), 'band', (lo, hi))
def _tube(m, sec, harm, att, rel, flame, cool=None):
    """one tube's note: harm, its harmonics' levels; flame, how much of the flame's hush and the tube's breath sound with it; cool,
    (from, to) seconds over which the tube cools, its note growing softer, then silent (the mark)"""
    f = hz(m); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    heat = on * off
    # as a tube cools, its note grows softer and plainer: the upper harmonics fade first
    cl = np.where(x < cool[0], 1.0, np.cos(0.5 * np.pi * np.clip((x - cool[0]) / (cool[1] - cool[0]), 0, 1)) ** 2) if cool else 1.0
    s = (harm[0] * np.sin(2 * np.pi * f * x) + cl * sum(a * np.sin(2 * np.pi * (k + 2) * f * x + 0.4 * (k + 1)) for k, a in enumerate(harm[1:]))) / sum(harm)
    rms = lambda v: float(np.sqrt((v.astype(np.float64) ** 2).mean())) + 1e-9
    # the tube's breath, a narrow band of air round the note, about 20 dB under it; the flame's hush, about 25 dB under it
    br = filt(R1.standard_normal(n).astype(np.float32), 'band', (f * 0.94, min(2200.0, f * 1.07))); br *= 0.05 / rms(br)
    fl = _flame(n, 110, 520); fl *= 0.028 / rms(fl)
    sig = (s + flame * (br + fl)) * heat * cl
    return filt(sig.astype(np.float32), 'low', 2200)
def tube(m, a, b, g=1.0, pan=0.0, att=0.35, rel=0.7, room=0.3):
    """a high tube: the tune, a note from a to b"""
    put(_held(_tube(m, max(0.3, b - a), (1.0, 0.30, 0.12, 0.04), att, rel, 1.0), room), a, g * TL, pan)
def low(m, a, b, g=1.0, pan=-0.1, att=0.6, rel=1.0, room=0.3):
    """a low tube: rounder and slower to heat, the ground under a turn"""
    put(_held(_tube(m, max(0.4, b - a), (1.0, 0.22, 0.06), att, rel, 0.7), room), a, g * PL, pan)
def mark(s, m=E5, g=1.0, pan=0.0, hot=1.2, cold=3.6):
    """the mark: a note that sounds while its tube is hot, softer as it cools, and silent when cold"""
    put(_held(_tube(m, cold, (1.0, 0.30, 0.12, 0.04), 0.4, 0.3, 1.0, cool=(hot, cold)), 0.3), s, g * TL, pan)
def chord(lo, hi, a, b, g=1.0, pan=0.0, ga=0.9):
    """a low tube under high ones: lo, one low note; hi, the high notes, sounded together"""
    low(lo, a, b, g * ga, pan * 0.5)
    for i, m in enumerate(hi):
        tube(m, a + 0.06 * i, b, g * (0.8 if len(hi) > 1 else 1.0), pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.013, pan=0.0, f=240):
    """a soft knock: a card or a window set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a row lit, a tag, a key"""
    s_tap(s, g * FX, pan)
def air(s, sec=0.9, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, down or up; the cold of the vault"""
    s_air(s, sec, g * FX, pan, lo, hi)
def paper(s, g=0.009, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (250, 1800)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def lock(s, g=0.009, pan=0.0):
    """a small lock closing: what is personal"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def door(s, g=0.012, pan=0.0):
    """the vault's door: a low, soft thud, and the cold air behind it"""
    s_knock(s, g * FX, pan, 95); air(s + 0.05, 1.6, 0.006, pan, 120, 600)

# =============================================================================================================================
# 1. The seed vault: the opening, with music all through it.
#    February 2008: the low E, and the vault opens (its door, the cold air). Minus eighteen degrees: the mark. From gene banks round
#    the world: G sharp to B. So breeders can grow crops that stand drought and disease: A major, warm. A gene bank near Aleppo: E to
#    G sharp; its samples, a card set down. Copies to the vault: B rising to E, and the copies' air going north. A bank can be lost:
#    C sharp minor. War came close: a low knock, C sharp minor, G sharp falling to E as the keepers leave; no longer send: one B.
#    Every variety at risk: C sharp minor, low. Unless the copies could come back: D sharp, held, open. They asked: B rising to E. 38,073 out of
#    the mountain: their air, E major. That November, the fields: A major. Nothing left in Aleppo: C sharp, alone. Yet no more than
#    1,657 lost: G sharp; breeders can order again: E major. Seeds in use, close and ready: B, warm; their copies, frozen far away:
#    the mark. Data can be kept the same way: the shelf, a knock. Read every day or once in seven years: a tap for each. The costliest
#    storage, none ever deleted: C sharp minor, and a small lock for the people in them. Now kept as it's read: the old years' air,
#    falling, and E major. The title: the low E, and the mark
V = lambda lid, word, off=0: W('vault', lid, word, off)
v0 = S0('vault')
low(E2, v0 + 0.5, V('feb', 'Deep', 1.2), 0.8, att=1.2, rel=1.2)
tube(B4, V('feb', 'Deep', 0.0), V('feb', 'Deep', 2.0), 0.6, px(700), att=0.6, rel=0.9)
door(V('feb', 'a vault opens', 0.0), 0.012, px(520))
tube(E5, V('feb', 'a vault opens', 0.3), V('feb', 'a vault opens', 1.9), 0.55, px(600), att=0.5, rel=1.0)
mark(V('copies', 'minus eighteen', 0.0), E5, 0.6, px(1500), hot=1.0, cold=3.2)
tube(Gs4, V('copies', 'from gene banks', 0.0), V('copies', 'from gene banks', 0.55), 0.5, px(1200), att=0.25, rel=0.3)
tube(B4, V('copies', 'from gene banks', 0.6), V('copies', 'from gene banks', 1.9), 0.5, px(1200), att=0.15, rel=0.9)
chord(A2, (Cs5,), V('banks', 'so breeders', 0.0), V('banks', 'so breeders', 2.2), 0.65, px(1600))
tube(E4, V('aleppo', 'Near Aleppo', 0.0), V('aleppo', 'Near Aleppo', 0.6), 0.5, px(1069), att=0.3, rel=0.3)
tube(Gs4, V('aleppo', 'Near Aleppo', 0.65), V('aleppo', 'Near Aleppo', 2.0), 0.5, px(1069), att=0.15, rel=0.9)
knock(V('aleppo', 'samples', -0.1), 0.012, px(1570), 250)
tube(B4, V('send', 'it sends copies', 0.0), V('send', 'it sends copies', 0.6), 0.5, px(1069), att=0.25, rel=0.3)
tube(E5, V('send', 'to the vault', 0.0), V('send', 'to the vault', 1.6), 0.5, px(765), att=0.15, rel=1.0)
air(V('send', 'it sends copies', 0.2), 1.6, 0.006, px(900), 200, 900)
low(Cs3, V('lost', 'can be lost', -0.2), V('lost', 'lost for good', 1.0), 0.7, att=0.6, rel=1.0)
tube(E4, V('lost', 'can be lost', 0.0), V('lost', 'can be lost', 1.6), 0.45, px(1600), att=0.4, rel=0.8)
tube(Gs4, V('lost', 'lost for good', 0.0), V('lost', 'lost for good', 1.2), 0.45, px(1600), att=0.3, rel=0.9)
knock(V('war', 'war came close', 0.0), 0.014, px(1069), 140)
low(Cs2, V('war', 'war came close', 0.05), V('war', 'had to leave', 1.2), 0.75, att=0.5, rel=1.1)
tube(Gs4, V('war', 'had to leave', -0.2), V('war', 'had to leave', 0.4), 0.45, px(1069), att=0.2, rel=0.3)
tube(E4, V('war', 'had to leave', 0.45), V('war', 'had to leave', 1.6), 0.45, px(1069), att=0.1, rel=0.9)
tube(B4, V('war', 'no longer send', 0.0), V('war', 'no longer send', 1.0), 0.4, px(1069), att=0.3, rel=0.6)
chord(Cs3, (E4,), V('risk', 'every variety', 0.0), V('risk', 'every variety', 2.2), 0.6, px(1500))
tube(Ds5, V('unless', 'Unless', 0.0), V('unless', 'Unless', 2.4), 0.45, px(960), att=0.5, rel=1.0)
tube(B4, V('ask', 'they asked', 0.0), V('ask', 'they asked', 0.5), 0.5, px(1065), att=0.2, rel=0.3)
tube(E5, V('ask', 'they asked', 0.55), V('ask', 'they asked', 1.8), 0.5, px(765), att=0.1, rel=0.9)
tOut = V('sown', 'came out', 0.0)
air(tOut, 1.8, 0.007, px(900), 150, 800)
chord(E2, (Gs4, B4), tOut + 0.1, tOut + 2.2, 0.6, px(1000))
chord(A2, (A4, Cs5), V('sown', 'that November', 0.0), V('sown', 'that November', 2.4), 0.6, px(960))
chord(Cs3, (Cs4,), V('gone', 'nothing was left', 0.0), V('gone', 'nothing was left', 2.0), 0.55, px(1160))
tube(Gs4, V('few', 'no more than', 0.0), V('few', 'no more than', 1.2), 0.45, px(870), att=0.4, rel=0.6)
chord(E2, (E5,), V('few', 'breeders can order', 0.0), V('few', 'breeders can order', 2.2), 0.6, px(870))
tube(WARM, V('kept', 'Seeds in use', 0.1), V('kept', 'Seeds in use', 1.6), 0.5, px(960), att=0.4, rel=0.8)
mark(V('kept', 'their copies', 0.1), E5, 0.55, px(1180), hot=1.2, cold=3.8)
knock(V('data', 'the same way', 0.0), 0.011, px(800), 250)
tap(V('alike', 'every day', 0.0), 0.007, px(1520)); tap(V('alike', 'once in seven years', 0.0), 0.007, px(160))
tNe = V('costly', 'none was ever', 0.0)
chord(Cs3, (E4,), tNe, tNe + 2.0, 0.5, px(500))
lock(V('costly', 'a risk', 0.2), 0.009, px(760))
tFo = V('now', 'follows how often', -0.3)
air(tFo, 1.4, 0.006, px(700), 120, 600)
chord(E2, (Gs4, B4), tFo + 0.4, tFo + 2.4, 0.55, px(960))
tT = G('vault', 'breath', 0.2)
low(E2, tT, E('vault') + 0.3, 0.75, att=1.0, rel=1.4)
mark(tT + 0.5, E5, 0.6, px(960), hot=1.6, cold=4.2)

# 2. Read often, or rarely: September, Noor: G sharp over the low E. Her second question: a tap for its card. The tiers, named hot,
#    cool, cold and archive: the hot tube, the cool, the cold, and the mark, each as its row lights. Less to keep, more to read: a tap
#    as the columns come in; hours for the archive: its air, rising slowly. Read often, where reading is cheap; rarely read, where
#    keeping is cheap: a tap for each. The data's contract: a sheet laid down, and A major, what's agreed
Q = lambda lid, word, off=0: W('tiers', lid, word, off)
chord(E3, (Gs4,), Q('noor', 'Noor', -0.1), Q('noor', 'Noor', 1.9), 0.55, px(360))
tap(Q('noor', 'how often is it read', 0.0), 0.008, px(1300))
tube(HOT, Q('names', 'named hot', 0.0), Q('names', 'named hot', 0.9), 0.45, px(1300), att=0.2, rel=0.5)
tube(WARM, Q('names', 'cool', 0.0), Q('names', 'cool', 0.9), 0.45, px(1300), att=0.2, rel=0.5)
tube(COLD, Q('names', 'cold and', 0.0), Q('names', 'cold and', 0.9), 0.45, px(1300), att=0.2, rel=0.5)
mark(Q('names', 'archive', 0.0), E5, 0.5, px(1300), hot=0.8, cold=2.6)
tap(Q('cost', 'less to keep', 0.0), 0.007, px(1500))
air(Q('cost', 'takes hours', 0.0), 1.8, 0.006, px(1600), 150, 700)
tap(Q('rule', "what's read often", 0.0), 0.007, px(1100)); tap(Q('rule', "what's rarely read", 0.0), 0.007, px(1100))
paper(Q('long', "data's contract", -0.1), 0.009, px(1300), 0.4)
chord(A2, (E5,), Q('long', "data's contract", 0.2), Q('long', "data's contract", 2.2), 0.55, px(1300))

# 3. Pay records: every pay day, payroll's record set down. Kept seven years: the cold tube. Until September, all in the hot tier:
#    C sharp minor. A year after it's written, each file moves down: its air, falling; the archive tier, its cheapest: the mark. Like
#    the copies on Svalbard, they sleep: the low E and the cold tube. The table is told: a tap for recent pay, a sheet for the files to
#    bring back. Bringing them back takes hours: the 2021 stack's air, rising slowly. Deleted on a date set in advance: B falling to
#    the low E. In October, the oldest records go: one soft breath of air. How to delete well is for the films on data protection: a
#    small lock
C = lambda lid, word, off=0: W('records', lid, word, off)
knock(C('records', 'Every pay day', 0.0), 0.011, px(306), 250)
tube(COLD, C('law', 'seven years', 0.0), C('law', 'seven years', 1.6), 0.45, px(930), att=0.4, rel=0.9)
tNe = C('before', 'none was ever', 0.0)
chord(Cs3, (E4,), tNe, tNe + 2.0, 0.5, px(500))
air(C('archive', 'a year after', 0.3), 1.2, 0.006, px(300), 120, 600)
mark(C('archive', 'archive tier', 0.0), E5, 0.5, px(1100), hot=0.9, cold=3.0)
tSl = C('vault', 'they sleep', -0.1)
chord(E2, (COLD,), tSl, tSl + 2.2, 0.5, px(1000))
tap(C('told', 'queries for recent pay', 0.1), 0.007, px(1770))
paper(C('told', 'which files', 0.0), 0.009, px(620), 0.4)
air(C('hours', 'takes hours', 0.0), 1.8, 0.006, px(1550), 150, 700)
tDa = C('seven', 'on a date', 0.0)
tube(B4, tDa, tDa + 0.6, 0.4, px(960), att=0.25, rel=0.3)
low(E2, tDa + 0.6, tDa + 2.4, 0.55, att=0.3, rel=1.0)
air(C('october', 'were deleted', 0.0), 1.4, 0.006, px(250), 120, 500)
lock(C('privacy', 'delete well', 0.0), 0.009, px(1540))

# 4. One record's years: one record moves down as it ages: the mark. Today, Linh's pay record is written: the hot tube, and a tap.
#    A year from now, its file moves to the archive tier: its air as it moves down, and the cold tube. An audit: it comes back, its air
#    rising. Seven years after it's written: B falling to the low E. At each step, where it lives follows how often it's read: E major
L = lambda lid, word, off=0: W('years', lid, word, off)
mark(L('ages', 'moves down', 0.0), E5, 0.5, px(1300), hot=0.9, cold=3.0)
tube(HOT, L('linh', 'is written', 0.0), L('linh', 'is written', 1.2), 0.45, px(1600), att=0.3, rel=0.6)
tap(L('linh', 'her payslip', 0.1), 0.008, px(1600))
tMv = L('year', 'moves to', 0.0)
air(tMv - 0.1, 1.2, 0.006, px(1600), 120, 600)
tube(COLD, tMv + 0.3, tMv + 1.5, 0.45, px(1600), att=0.3, rel=0.7)
air(L('audit', 'comes back', 0.0), 1.4, 0.006, px(1600), 150, 800)
tDl = L('seven', "it's deleted", 0.0)
tube(B4, tDl, tDl + 0.6, 0.4, px(1300), att=0.25, rel=0.3)
low(E2, tDl + 0.6, tDl + 2.2, 0.5, att=0.3, rel=1.0)
chord(E2, (Gs4, B4), L('follow', 'follows how often', 0.0), L('follow', 'follows how often', 2.0), 0.5, px(960))

# 5. Kept as it's read: on Svalbard the vault stays cold and still: the low E and the cold tube. In Lebanon and Morocco the bank sends
#    out its seeds again: A major, and the seeds' air. At the university: old pay records, kept cheaply, the
#    mark. Today, 2,960 pay records: a card set down. How often data is read decides where it's kept: B over the
#    low E. The docs: a tap for each word. Next: a card. The end card: the low E, and the mark
Z = lambda lid, word, off=0: W('close', lid, word, off)
chord(E2, (COLD,), Z('svalbard', 'cold and still', -0.1), Z('svalbard', 'cold and still', 2.2), 0.5, px(1280))
tLb = Z('svalbard', 'sends out', 0.0)
air(tLb, 1.6, 0.006, px(960), 150, 800)
chord(A2, (Cs5,), tLb + 0.1, tLb + 2.1, 0.5, px(960))
mark(Z('university', 'old pay records', 0.0), E5, 0.45, px(1300), hot=0.8, cold=2.4)
tTd = G('close', 'today', 0.3)
knock(tTd, 0.011, px(1270), 250)
tTk = G('close', 'takeaway', 0.0)
chord(E2, (WARM,), tTk, tTk + 2.2, 0.5, px(1270))
for i, w_ in enumerate(('investigate', 'adapt', 'implement', 'iterate')):
    tap(Z('docs', w_, 0.0), 0.007, px(960 + 180 * i))
knock(G('close', 'next', 0.2), 0.011, px(1270), 250)
tEn = G('close', 'breath', 0.3)
low(E2, tEn, E('close') + 0.2, 0.7, att=1.0, rel=1.6)
mark(tEn + 0.6, E5, 0.55, px(960), hot=1.4, cold=3.8)
