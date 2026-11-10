# More readers than people: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The palette, reserved for this film by the module's setup thread on 5 November 2026
# (/mnt/project-files/modern-data-basics/palettes.md), after checking every score.py and music.py on main and on every branch: a horn
# violin, the violin whose body is a metal horn, made around 1900 so that the recording machines of the time could hear it: an
# instrument made for a machine to read, as the road signs of 1968 and casual teaching cost are. Never named by its maker. No partner:
# this film's thread found every colour the site lacks either belongs to another culture or sounds like one the site has (palettes.md's
# list), so the horn violin plays alone, bowed and plucked, as film 4 keeps to two ophicleides and film 6 to its two gongs (the
# film's assumptions, row 19). Made here: music.py has no horn violin.
#  - Bowed (bow()): a bowed string's harmonics, each softer than the last, heard through the horn and its diaphragm, which pass little
#    below about 400 Hz (it has no wooden body) and give it a narrow, nasal peak near 1.1 kHz and a smaller one near 1.7 kHz: the thin,
#    metallic voice that sets it apart from the site's strings. Bowed softly, no vibrato; a note of a second or more swells a little and
#    eases, once. Two strings bowed together (a double stop) are one sound, tuned pure.
#  - Plucked (plk()): the same strings plucked by a finger, through the same horn: a short, dry, tinny note, damped within a second.
#  - The film's mark (palettes.md): a phrase played plain, then the same phrase as the horn gives it. Plain: G, A flat, B flat, E flat,
#    plucked, quick (plain()); then the horn gives the same four notes bowed, slow, each held (horn()). It sounds where something made
#    once for people is read by machines too: the plain phrase as the convention defines each sign once, the horn's as the car reads
#    the limit off the sign; both in the close, at "made once, for people, and machines read it too"; and the plain phrase on the end card.
#  - E-flat major for the signs agreed and the measure read where it's defined; C minor for the problem (the signs in words that a
#    driver from abroad can't read, and a reader that counts its own way). All tuned pure (just intonation from E flat): F is never
#    sounded with A flat, whose third (32/27) would beat.
# The module's rules (palettes.md and the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn or under a moment on screen; never a bed under the voice. Here
#    that's a bowed note at each chapter's turn and a note where a reader gets its answer, and silence between.
#  - Nothing trembles or pulses, no vibrato; no urgent pulse anywhere (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a soft knock as a card is set down, a muffled key as a line or a tag
#    comes in, paper as a report or a note is laid down, a breath of air as a lane runs or a window opens, a small lock for a rule that
#    keeps something out, a soft low thud for the crash. Never a car horn (palettes.md), an engine or a screech.
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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1968)  # this film's own randomness: the room, the bow's hair and the finger's touch

# ---- tuning: just intonation from E flat, so two notes sounded together are whole-number ratios of each other and nothing beats.
# E-flat major (E flat, G, B flat), A-flat major, B-flat major, C minor and G minor are pure here; F with A flat is not (32/27)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
G3, Ab3, Bb3, C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5 = 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75
MARK = (G4, Ab4, Bb4, Eb5)  # the film's mark: played plain, plucked, then as the horn gives it, bowed

# ---- the levels, set by tools/quiet.py's measure as one speaker plays the score: the music's loud moments under -26.5 dB of full
# scale and its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
HL, PL, FX = 0.080, 0.090, 1.5

# a room round the player: a small, plain hall, ringing on for about a second, and nothing much above 1.5 kHz. Its level is set by what
# it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one, held.py): scaled by all it rings, a room rings about 10 dB
# louder there than its share says. Each held note is then set back to its own level (_held), since even so the room's reflections
# meet a held note's own sound, adding to it on one pitch and taking from it on another
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b seconds,
    once the bow has taken the string and before it leaves). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j].astype(np.float64) ** 2).mean() / max(1e-12, (r[i:j].astype(np.float64) ** 2).mean())))

# ---- the horn: what the metal horn and its diaphragm make of the string's sound. Little below about 400 Hz (there's no wooden body to
# carry it), a narrow, nasal peak near 1.1 kHz and a smaller one near 1.7 kHz, a little of the low middle near 600 Hz, and nothing
# above 2.4 kHz (the filter after it)
HORN = ((1080, 240, 1.0), (1700, 360, 0.55), (620, 300, 0.25))
def _horn(fk):
    hp = (fk / 420) ** 2 / (1 + (fk / 420) ** 2)
    return hp * (0.22 + sum(w / (1 + ((fk - c) / (b / 2)) ** 2) for c, b, w in HORN))

# ---- bowed: each string's harmonics as a bow draws them (each softer than the last), through the horn. The bow is soft: the higher
# harmonics speak a moment after the first, and a faint hiss of the hair on the string comes with the note's start. Held steady, no
# vibrato; a note of a second or more swells a little and eases, once. m2: a second string bowed with it, one sound
def _bowed(fs, sec, att, rel):
    n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for j, f in enumerate(fs):
        ph = R1.uniform(0, 2 * np.pi, 40)
        for k in range(1, int(2400 // f) + 1):
            fk = f * k; w = _horn(fk) / k * (1.0 if j == 0 else 0.85)
            on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.1 * (k - 1))), 1)) ** 2
            off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.5 * (k - 1)) / rel), 1.0)
            s = s + w * on * off * np.sin(2 * np.pi * fk * x + ph[k % 40])
    if sec >= 1.0:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    hair = filt(noise(n / SR + 0.01)[:n], 'band', (900, 2000)) * 0.012 * np.exp(-x / 0.09)
    return filt((s + hair).astype(np.float32), 'low', 2400)
def bow(m, a, b, g=1.0, m2=None, att=0.22, rel=0.35, pan=0.05, room=0.28):
    """the horn violin bowed from a to b seconds (with m2, two strings together)"""
    sec = max(0.3, b - a); fs = [hz(m)] + ([hz(m2)] if m2 else [])
    put(_held(_bowed(fs, sec, att, rel), room, min(sec, 0.3), max(min(sec, 0.3) + 0.01, sec - 0.05)), a, g * HL, pan)

# ---- plucked: a string plucked by a finger, a quarter of the way along, through the same horn: its harmonics die fast, the higher
# first, and the finger damps it after ring seconds; the finger's touch is a small, dull tick
def plk(m, s, g=1.0, ring=0.8, pan=0.05, room=0.2):
    f = hz(m); sec = ring + 0.25; x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    for k in range(1, int(2400 // f) + 1):
        d = ring * 0.55 / (1 + 0.35 * (k - 1))
        sig = sig + _horn(f * k) * abs(np.sin(np.pi * k * 0.25)) / k ** 1.3 * np.exp(-x / d) * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    sig = sig * np.minimum(1, x / 0.002) * np.where(x < ring, 1.0, np.cos(0.5 * np.pi * np.minimum((x - ring) / 0.2, 1)) ** 2)
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    nt = int(0.02 * SR); sig[:nt] += filt(noise(0.02)[:nt], 'band', (500, 1600)) * np.exp(-np.arange(nt) / SR / 0.004) * 0.08
    put(_room(filt(sig.astype(np.float32), 'low', 2400), room), s, g * PL, pan)

def plain(t0, g=1.0, pan=0.0):
    """the mark, played plain: the four notes plucked, quick"""
    for i, m in enumerate(MARK):
        plk(m, t0 + 0.2 * i, g * (0.9 if i < 3 else 1.0), ring=0.5 if i < 3 else 1.0, pan=pan)
def horn(t0, g=1.0, pan=0.0, last=1.8):
    """the mark as the horn gives it: the same four notes bowed, slow, each held to the next, the last held"""
    for i, m in enumerate(MARK):
        bow(m, t0 + 0.9 * i, t0 + 0.9 * i + (0.95 if i < 3 else last), g * (0.8 if i < 3 else 0.9), att=0.12 if i else 0.2, rel=0.25 if i < 3 else 0.6, pan=pan)

# ---- soft sounds, all low-passed, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a tag, a pill or a line comes in, a row or a key lights"""
    s_tap(s, g * FX, pan)
def keys(s, n, sec, g=0.007, pan=0.0):
    """a few muffled keys, spread over sec: a question typed"""
    for i in range(n):
        s_tap(s + sec * i / max(1, n - 1), g * FX * (0.85 + 0.15 * (i % 2)), pan)
def paper(s, g=0.012, pan=0.0, sec=0.45):
    """a sheet laid down: a report, a note"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: a lane running, a window opening"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing: a rule that keeps something out"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def thud(s, g=0.016, pan=0.0):
    """a soft, low thud, far off: the crash, shown as a red glow"""
    s_knock(s, g * FX, pan, 95); x = tt(0.5); X(filt(noise(0.5), 'low', 300)[:len(x)] * np.exp(-x / 0.12), s + 0.01, g * 0.6 * FX, pan)

# =============================================================================================================================
# 1. Vienna, 1968: the opening, music all through it. E-flat major as the cars cross from one country into the next and the conference
#    sits for a month; C minor as the signs differ, in words, and a driver from abroad misses the bend; nothing under "Something has to
#    change". E-flat major again as the treaty is signed: each sign defined once, and the mark played plain as its symbol comes; the
#    three kinds; today, the same signs, a pluck as the first car takes the bend; readers nobody planned for, and the mark as the horn
#    gives it while the car reads the limit off the sign. The university: the measure, its five readers; C minor for a reader that counts
#    its own way; E-flat major as every reader reads where it's defined, as itself; the title card, two strings bowed together
sg = lambda lid, word, off=0: W('signs', lid, word, off)
s0 = S0('signs')
bow(Bb4, s0 + 0.7, s0 + 3.3, 0.75, att=0.7, rel=0.8)
bow(G4, sg('drive', 'More people', -0.3), sg('drive', 'drive', -0.1), 0.65, att=0.3)
bow(Ab4, sg('drive', 'drive', 0.0), sg('drive', 'the next', -0.2), 0.6, att=0.2)
bow(Bb4, sg('drive', 'the next', -0.1), END('signs', 'drive') + 0.8, 0.7, att=0.3, rel=0.7)
air(sg('drive', 'the next', -0.4), 0.9, 0.007, px(1500), 160, 800)
# the conference: its card set down; the month, a day at a time, as one soft brush; the fifth held under it
knock(G('signs', 'meet', -0.3), 0.013, px(960), 240)
bow(Eb4, G('signs', 'meet', -0.1), sg('meet', 'a month', 0.6), 0.65, m2=Bb4, att=0.5, rel=0.8)
air(sg('meet', 'a month', -0.2), 2.4, 0.006, px(960), 200, 1000)
bow(C5, sg('meet', 'rules of the road', 0.0), END('signs', 'meet') + 0.4, 0.55, att=0.3, rel=0.6)
# the signs still differ: C minor; a plate set up for each country, its message in words
bow(C4, sg('differ', 'still differ', -0.2), sg('differ', 'own language', 0.2), 0.65, m2=G4, att=0.5, rel=0.9)
for i in range(4):
    knock(sg('differ', 'in words', -0.3 + 0.3 * i), 0.010, px((620, 1300, 620, 1300)[i]), 250)
tap(sg('differ', 'own language', -0.3), 0.008, px(960))
# a driver from abroad passes the warning in words: a low, thin note; a question, plucked, as the "?" comes; the crash, a soft thud
bow(Eb4, G('signs', 'miss', -0.1), sg('miss', 'never know', 0.0), 0.55, att=0.6, rel=0.7)
plk(Ab4, sg('miss', 'never know', -0.2), 0.6, ring=0.9)
thud(sg('crash', 'crash', -0.05), 0.016, px(900))
bow(C4, sg('crash', 'crash', 0.0), sg('crash', 'crash', 1.6), 0.6, m2=Eb4, att=0.15, rel=0.9)
# something has to change: nothing. Then the treaty, E-flat major: its card set down, the 31 countries; each sign defined once, by its
# shape, its colour and its symbol, and the mark, plain
knock(G('signs', 'sign', -0.3), 0.014, px(960), 230)
bow(Eb4, G('signs', 'sign', 0.0), sg('sign', 'thirty-one', 0.2), 0.7, att=0.5, rel=0.6)
tap(sg('sign', 'thirty-one', -0.1), 0.009, px(960))
bow(Bb4, sg('sign', 'treaty', -0.1), END('signs', 'sign') + 0.3, 0.6, att=0.3, rel=0.8)
for w in ('shape', 'colour', 'symbol'):
    tap(sg('once', w, -0.1), 0.008, px(960))
plain(sg('once', 'symbol', 0.5), 0.85)
# the three kinds: the triangle moves aside, the circle and the blue circle come in, each a soft knock; a held note under them
knock(sg('shapes', 'A circle', -0.2), 0.011, px(960), 260)
knock(sg('shapes', 'A blue circle', -0.2), 0.011, px(1360), 280)
bow(G4, sg('shapes', 'A blue circle', 0.0), END('signs', 'shapes') + 0.6, 0.55, att=0.4, rel=0.8)
# today: the same signs from one country to the next; the first car takes the bend (a pluck as its tick comes)
bow(Eb4, G('signs', 'today', -0.2), sg('today', 'same signs', 0.0), 0.6, m2=Bb4, att=0.5, rel=0.8)
tap(sg('today', 'seventy-five', -0.2), 0.009, px(300))
plk(Eb5, G('signs', 'today', 4.6), 0.55, ring=1.0, pan=px(1400))
# readers nobody planned for: a note held, wondering; the limit sign; the car reads it: the mark, as the horn gives it; the display
bow(C5, sg('new', 'nobody', -0.1), END('signs', 'new') + 0.3, 0.5, att=0.4, rel=0.7)
horn(sg('cars', 'read the speed limit', -0.1), 0.8, pan=px(1200))
knock(sg('cars', 'read the speed limit', 0.2), 0.012, px(1630), 250)
tap(sg('cars', 'European Union', -0.3), 0.008, px(400))
# data has readers too: the measure set down, a note under it; its five readers, each a tap as its lane runs
knock(sg('data', 'Data', -0.1), 0.014, px(960), 240)
bow(Eb4, sg('data', 'Data', 0.0), END('signs', 'data') + 0.5, 0.55, att=0.5, rel=0.8)
for word, x in (('by people', 330), ("Finance's reports", 330), ('an app', 1590), ('an agent', 1590), ('a partner', 960)):
    tap(sg('readers', word, -0.2), 0.008, px(x))
# a reader that counts its own way: C minor as its number turns red; one that reads as someone else: the lock on what it shouldn't see
bow(C4, sg('wrong', 'counts its own way', -0.1), sg('wrong', 'counts its own way', 1.7), 0.6, m2=Eb4, att=0.2, rel=0.8)
lock(sg('wrong', 'someone else', -0.1), 0.010, px(1590))
# read where it's defined, each as itself: E-flat major as the keys turn green; the same number, a pluck
tap(sg('right', 'each as itself', -0.2), 0.008, px(960))
bow(Eb4, sg('right', 'each as itself', 0.0), sg('right', 'same number', 0.4), 0.6, m2=G4, att=0.4, rel=0.8)
plk(Bb4, sg('right', 'same number', 0.0), 0.5, ring=0.9)
# the title card: two strings bowed together, E flat and B flat, as the wheel draws itself
bow(Eb4, G('signs', 'breath', 0.3), G('signs', 'breath', 3.8), 0.7, m2=Bb4, att=0.8, rel=1.2)

# 2. One door for every reader: Bb at the turn, pay day. Rohan's measure set down, its owner's tag; Genie One's window, the question
#    typed, and the answer plucked; the budget pack laid down, C minor as its number turns red; the mirror: the platform, Fabric's pane,
#    the mirror's lane, the slot with no metric views; the report sums the pay paid; the one sign-in, and the rights that stay behind (a
#    lock). The connector: E-flat major as the report reads the measure from Databricks itself, each analyst's key; the measure asked
#    for by name, the same number plucked; Noor's rule, its lines, and G held under the second
dw = lambda lid, word, off=0: W('door', lid, word, off)
d0 = S0('door')
bow(Bb4, d0 + 0.5, d0 + 2.1, 0.6, att=0.4, rel=0.8)
knock(d0 + 0.5, 0.012, px(800), 240)
knock(dw('rohan', 'owns', -0.2), 0.013, px(1465), 240)
tap(dw('rohan', 'owns', 0.7), 0.008, px(1300))
air(dw('defined', 'metric view', -0.3), 0.8, 0.007, px(1465), 160, 800)
tap(dw('defined', 'Unity Catalog', -0.2), 0.008, px(1465))
knock(dw('genie', 'when he asks', -0.5), 0.012, px(800), 250)
keys(dw('genie', 'when he asks', -0.1), 4, 0.9, 0.006, px(800))
plk(Eb5, dw('genie', 'one point eight four', -0.1), 0.6, ring=1.0, pan=px(800))
paper(dw('pack', 'budget pack', -0.3), 0.012, px(800), 0.45)
bow(C4, dw('pack', 'one point five six', -0.1), dw('pack', 'one point five six', 1.5), 0.6, m2=Eb4, att=0.2, rel=0.8)
tap(dw('pack', 'same name', -0.1), 0.008, px(1465))
knock(dw('bi', "university's catalog", -0.3), 0.012, px(420), 240)
knock(dw('bi', 'Microsoft Fabric', -0.3), 0.012, px(1500), 250)
air(dw('bi', 'a mirror', -0.1), 0.9, 0.008, px(960), 160, 900)
tap(dw('mirror', 'tables', -0.2), 0.008, px(1500))
tap(dw('mirror', 'metric views', -0.2), 0.008, px(1340))
tap(dw('counted', 'summed', -0.2), 0.008, px(1540))
tap(dw('rights', 'the one sign-in', -0.3), 0.008, px(960))
lock(dw('rights', 'rights stay behind', -0.3), 0.010, px(386))
air(dw('direct', 'connector', -0.4), 0.9, 0.008, px(700), 160, 900)
bow(Eb4, dw('direct', 'from Databricks', -0.2), dw('direct', 'from Databricks', 2.2), 0.6, m2=Bb4, att=0.4, rel=0.8)
for i in range(3):
    tap(dw('direct', 'each analyst', -0.2 + 0.25 * i), 0.007, px(1600 + 80 * i))
tap(dw('same', 'by name', -0.2), 0.008, px(400))
plk(Eb5, dw('same', 'one point eight four', -0.1), 0.55, ring=1.0, pan=px(1500))
knock(dw('noor', 'mirror only', -0.5), 0.012, px(600), 240)
tap(dw('noor', 'mirror only', -0.2), 0.007, px(600))
tap(dw('noor', 'and read a measure', -0.2), 0.007, px(600))
bow(G4, dw('noor', 'and read a measure', 0.0), END('door', 'noor') + 0.6, 0.5, att=0.4, rel=0.8)

# 3. An app that reads as you: G at the turn, Anil. The planning app's window opens; each faculty's tab, the locks on the others; the
#    cost, the hours; the two ways an app can read, each card set down, and E-flat major as this one reads as the person; the filter in
#    Unity Catalog: the claims and their lock, the app's code; Anil sees Health's numbers, a pluck as his list comes
aw = lambda lid, word, off=0: W('app', lid, word, off)
a0 = S0('app')
bow(G4, a0 + 0.5, a0 + 2.0, 0.6, att=0.4, rel=0.8)
air(aw('app', 'an app', -0.3), 0.8, 0.007, px(1190), 160, 900)
knock(aw('app', 'an app', -0.1), 0.012, px(1190), 240)
tap(aw('shows', 'casual teaching cost', -0.2), 0.008, px(800))
tap(aw('shows', 'the hours', -0.1), 0.007, px(1400))
tap(aw('each', 'Every faculty', 0.0), 0.007, px(900))
lock(aw('each', 'only its own', -0.1), 0.009, px(1100))
knock(aw('two', 'as itself', -0.4), 0.012, px(500), 240)
knock(aw('two', 'or as the person', -0.4), 0.012, px(1420), 250)
bow(Eb4, aw('asks', 'This one', -0.1), aw('asks', 'This one', 2.0), 0.6, m2=Bb4, att=0.4, rel=0.8)
tap(aw('asks', 'run queries', -0.3), 0.008, px(1600))
knock(aw('filter', 'the claims', -0.2), 0.011, px(1160), 230)
lock(aw('filter', 'the claims', 0.1), 0.009, px(1160))
tap(aw('filter', 'a filter by faculty', -0.2), 0.008, px(1000))
air(aw('sees', 'Anil sees', -0.2), 0.7, 0.007, px(800), 160, 900)
plk(Bb4, aw('sees', 'Anil sees', 0.1), 0.55, ring=1.0, pan=px(1630))
tap(aw('sees', "nothing in the app's code", -0.2), 0.008, px(420))
knock(aw('rule', 'Let an app', -0.5), 0.012, px(600), 240)
tap(aw('rule', 'and keep the rules', -0.2), 0.007, px(600))

# 4. An agent reads the words too: E flat at the turn, Rohan's note. The note laid down, its rows; the pay-day agent comes, its draft;
#    the tool server, Genie One and the measure, each set down, the lanes running; the same definition, plucked. Its instructions laid
#    down, the word marked; the measure's words, and the synonym lit, plucked; like a car reading a sign: the first two notes of the
#    horn's mark, bowed, as the car reads it. Its own name, its badge; what it may read, and the lock on the claims; Rohan checks the
#    note and sends it: E-flat major
gw = lambda lid, word, off=0: W('agent', lid, word, off)
g0 = S0('agent')
bow(Eb5, g0 + 0.5, g0 + 2.0, 0.5, att=0.4, rel=0.8)
paper(gw('note', 'the deans', -0.4), 0.011, px(980), 0.45)
tap(gw('note', "each faculty's", -0.2), 0.007, px(980))
air(gw('drafts', 'pay-day agent', -0.4), 0.8, 0.007, px(1600), 180, 900)
tap(gw('drafts', 'drafts the note', 0.0), 0.008, px(1250))
knock(gw('asks', 'a tool server', -0.3), 0.012, px(525), 240)
knock(gw('asks', 'Genie One', -0.3), 0.012, px(985), 250)
air(gw('asks', 'Genie One', -0.1), 0.6, 0.006, px(760), 180, 900)
knock(gw('asks', 'answers', -0.4), 0.012, px(1540), 230)
plk(Eb5, gw('asks', 'same definition', 0.0), 0.55, ring=1.0, pan=px(1540))
paper(gw('words', 'Its instructions', -0.3), 0.010, px(490), 0.4)
tap(gw('words', 'sessional', -0.1), 0.008, px(490))
knock(gw('words', 'knows the word', -0.5), 0.012, px(1400), 240)
plk(Bb4, gw('words', 'knows the word', 0.0), 0.5, ring=0.9, pan=px(1400))
knock(gw('car', 'Like a car', -0.3), 0.011, px(490), 250)
bow(G4, gw('car', 'Like a car', 0.6), gw('car', 'Like a car', 1.65), 0.5, att=0.2, rel=0.3, pan=px(600))
bow(Ab4, gw('car', 'Like a car', 1.6), gw('car', 'Like a car', 3.2), 0.5, att=0.12, rel=0.6, pan=px(600))
for w in ('its name', 'its description', 'its synonyms'):
    tap(gw('car', w, -0.1), 0.007, px(1400))
knock(gw('alone', 'a name of its own', -0.3), 0.011, px(230), 380)
tap(gw('alone', 'on a schedule', -0.3), 0.007, px(560))
tap(gw('alone', 'same rules', -0.3), 0.007, px(560))
knock(gw('grants', 'It may ask', -0.5), 0.011, px(490), 240)
tap(gw('grants', 'read the measure', -0.2), 0.007, px(490))
lock(gw('grants', "can't read the claims", -0.2), 0.010, px(490))
tap(gw('sends', 'Rohan checks', -0.3), 0.008, px(1146))
bow(Eb4, gw('sends', 'and sends it', 0.0), gw('sends', 'and sends it', 2.2), 0.6, m2=Bb4, att=0.3, rel=0.9)
tap(gw('sends', 'and sends it', 0.0), 0.008, px(1710))
knock(gw('rule', 'Give every reader', -0.5), 0.012, px(650), 240)
tap(gw('rule', 'and only what', -0.2), 0.007, px(650))

# 5. Outside, only the totals: E flat and B flat together at the turn. The university and its platform, the group of universities set
#    down; OpenSharing's lane, and the measure read where it lives, plucked; no copy. Ingrid's rule: a tap for each line; the units, the
#    one tutor's row, and the lock on that tutor's pay, C minor; the small table made from the measure, its lane and its share; the group
#    reads the same definition's numbers, plucked
hw = lambda lid, word, off=0: W('share', lid, word, off)
h0 = S0('share')
bow(Bb4, h0 + 0.5, h0 + 2.1, 0.5, m2=Eb5, att=0.4, rel=0.8)
knock(hw('group', 'a group of universities', -0.3), 0.012, px(1610), 240)
air(hw('share', 'OpenSharing', -0.3), 0.9, 0.008, px(1200), 160, 900)
knock(hw('share', 'where it lives', -0.2), 0.011, px(1610), 250)
plk(Bb4, hw('share', 'where it lives', 0.0), 0.55, ring=1.0, pan=px(1610))
tap(hw('share', 'no copy', -0.2), 0.008, px(1610))
knock(hw('ingrid', 'totals by faculty', -0.5), 0.012, px(970), 240)
tap(hw('ingrid', 'totals by faculty', -0.2), 0.007, px(970))
tap(hw('ingrid', 'never by unit', -0.2), 0.007, px(970))
knock(G('share', 'why', -0.4), 0.011, px(840), 250)
tap(hw('why', 'one tutor', -0.2), 0.007, px(840))
lock(hw('why', 'give away', -0.2), 0.010, px(1090))
bow(C4, hw('why', 'give away', 0.0), hw('why', 'give away', 1.6), 0.55, m2=Eb4, att=0.25, rel=0.8)
knock(hw('table', 'one small table', -0.3), 0.012, px(810), 240)
air(hw('table', 'made from the measure', -0.3), 0.6, 0.006, px(770), 180, 900)
knock(hw('table', 'one small table', 0.3), 0.011, px(1610), 260)
tap(hw('table', 'by faculty', -0.2), 0.007, px(1610))
tap(hw('table', 'have ended', -0.2), 0.007, px(1610))
plk(Eb5, hw('reads', 'reads the same', 0.1), 0.55, ring=1.0, pan=px(1610))
knock(hw('rule', 'Outside the platform', -0.5), 0.012, px(670), 240)
tap(hw('rule', 'and make it', -0.2), 0.007, px(670))

# 6. One definition, every reader: E flat and G together at the turn, one number; each reader's number, a tap; each reader's key as it
#    sees only what it may. Vienna: the signs set down; made once, for people: the mark, plain; and machines read it too: the mark as
#    the horn gives it. Every reader shows who it is; written down in the data project, the exposures; a change names who it touches;
#    the rules, a line at a time; the standards already there: E flat and B flat as the wheel draws itself; the four words and the
#    official docs; the convention still improving; next. The end card: the mark, plain, and E flat and G under it
ew = lambda lid, word, off=0: W('close', lid, word, off)
e0 = S0('close')
bow(Eb4, e0 + 0.5, e0 + 2.6, 0.6, m2=G4, att=0.4, rel=0.9)
tap(ew('back', 'one number', -0.2), 0.008, px(960))
for w, x in (('in Genie One', 330), ('in Power BI', 330), ('in the app', 1590), ("the agent's draft", 1590)):
    tap(ew('same', w, 0.4), 0.007, px(x))
lock(ew('may', 'only what it may', -0.3), 0.009, px(960))
knock(ew('vienna', 'Vienna', -0.3), 0.012, px(520), 240)
plain(ew('vienna', 'made once', 0.0), 0.8, pan=px(520))
horn(ew('vienna', 'machines', 0.0), 0.75, pan=px(640))
tap(ew('unlike', 'every reader shows', -0.2), 0.008, px(1400))
knock(ew('known', 'written down', -0.4), 0.012, px(960), 240)
tap(ew('known', 'written down', 0.0), 0.007, px(1500))
tap(ew('known', 'a change to the measure', -0.1), 0.008, px(500))
air(ew('known', 'names who it touches', -0.2), 0.9, 0.007, px(1200), 160, 900)
knock(ew('where', 'Read each measure', -0.5), 0.012, px(960), 240)
tap(ew('who', 'Let each reader', -0.2), 0.007, px(960))
tap(ew('least', 'share the least', -0.2), 0.007, px(960))
bow(Eb4, ew('wheel', 'standards', -0.1), ew('wheel', 'standards', 2.4), 0.6, m2=Bb4, att=0.5, rel=0.9, pan=px(760))
tap(ew('iterate', 'Investigate', -0.2), 0.007, px(760))
tap(ew('iterate', 'official docs', -0.3), 0.008, px(760))
knock(ew('still', 'convention', -0.3), 0.011, px(1500), 260)
tap(ew('still', 'comes into force', -0.3), 0.007, px(1500))
knock(ew('next', 'Next', -0.2), 0.012, px(960), 240)
plain(G('close', 'breath', 0.7), 0.75)
bow(Eb4, G('close', 'breath', 1.6), G('close', 'breath', 4.2), 0.55, m2=G4, att=0.6, rel=1.0)
