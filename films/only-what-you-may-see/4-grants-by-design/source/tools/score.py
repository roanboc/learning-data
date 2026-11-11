# Grants by design: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, taken for this film on 5 November 2026 after checking every score.py on main and on every branch, and every
# palettes list in the project files (/mnt/project-files/data-protection/palettes.md, where it is written):
#  - The lead, a Cristal Baschet, the instrument Bernard and François Baschet made in Paris in 1952: glass rods stroked with wet
#    fingers set the steel rods behind them ringing, and cones of metal carry the sound out. Made here (music.py has none): a held,
#    round, soft note that blooms as the finger draws (its upper partials come in a little after its fundamental), holds at an even
#    level while the finger draws, and rings on in the steel when the finger lifts, its upper partials dying first; the cone's warmth
#    round 500 to 900 Hz, and the faint draw of a wet finger as the stroke begins. Low and in the middle (C3 to G5), no vibrato,
#    nothing above about 2.3 kHz. Kept low and plain, with the steel's own ring, so it sounds unlike the glass harmonica of two
#    governance films (rubbed bowls, higher and brighter).
#  - The steel behind: a touch at the front rings in all the steel behind it. Here, the same note an octave or two lower, blooming in
#    with no touch of its own (steel()), as a grant on a catalog or a shelf reaches every table on it, today's and tomorrow's. Each new
#    thing that fits the plan (a boat, a guide, a visitor, a table, a person) is one touch, and the steel answers it an octave below.
#  - The mark: a chord touched once, high, then heard an octave and two octaves below without being touched again (mark()). It
#    sounds where the islands' visits are planned once and where the university's grants are designed once, in the opening; where a
#    grant on a shelf reaches every table on it; and at the end, with the film's idea.
#  - The partner, a French horn, soft and low, one voice, no vibrato: the guides who walk each group along the islands' trails, under
#    the opening and wherever the film comes back to the islands, a few notes each time and never the same phrase twice. One note
#    stopped by the hand in its bell, muted, thin and short, where a door stays shut: SELECT alone, which opens nothing; the exam
#    support table, which the readers of core never reach; and the study, which reads the registrar's catalog and never writes.
#  - E-flat major; C minor for the grants made one at a time. Just intonation from E-flat (see hz()), so held notes never beat:
#    E-flat, A-flat and B-flat major, and C and G minor are pure in this table; F never sounds with A-flat or C.
# The rules every film of the module keeps (the module's proposal, *The sound*):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato. No urgent pulse: nothing in this story is a breach or a
#    rush. No figure played again and again. Nothing borrowed from the islands' place: no birdsong, no foghorn, no ship's bell.
#  - Every sound is an event on screen, at the moment it appears: each one below uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. A burst on screen (a row of chips, fifty grants
#    drawn at once) is one soft sound, never one for each.
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
R1 = np.random.default_rng(1952)  # this film's own randomness: the room, the finger's draw, the air and the sea

# ---- tuning: just intonation from E-flat, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (51, 155.563)  # E-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
C2, Eb2, G2, Ab2, Bb2 = 36, 39, 43, 44, 46
C3, D3, Eb3, F3, G3, Ab3, Bb3 = 48, 50, 51, 53, 55, 56, 58
C4, D4, Eb4, F4, G4, Ab4, Bb4 = 60, 62, 63, 65, 67, 68, 70
C5, D5, Eb5 = 72, 74, 75
EB = (Eb4, G4, Bb4)  # the mark's chord, touched high

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the steel behind a little under the glass; the horn soft; the
# effects well under the music (FX scales them all)
BL, SL, HL, FX = 0.050, 0.036, 0.046, 2.0

# a room round the players: a small, quiet hall, ringing on for about a second and a half, nothing much above 1.8 kHz. Its level is
# set by what it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it
# (_held), as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.022 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
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
def _tail(sig, n):
    """a soft end to a note's array, so nothing clicks where it stops"""
    x = np.arange(len(sig)) / SR
    return sig * np.cos(0.5 * np.pi * np.clip((x - n / SR + 0.1) / 0.1, 0, 1)) ** 2

# ---- the Cristal Baschet: a glass rod stroked with a wet finger. The note blooms as the finger draws (each partial a little after
# the one below it), holds at an even level while the finger draws (sec), and rings on in the steel when it lifts (rel), its upper
# partials dying first. The cone's warmth lifts it round 500 to 900 Hz; the finger's draw is a breath of friction at the note's own
# pitch as the stroke begins, gone as the note blooms. Harmonic partials only, so no two notes beat
BAS = ((1, 1.0), (2, 0.36), (3, 0.24), (4, 0.09), (5, 0.07), (6, 0.03), (7, 0.022))
def bas(m, s, sec=1.0, g=1.0, pan=0.0, att=0.35, rel=1.1, room=0.3, draw=1.0):
    f = hz(m); n = int((sec + 5 * rel + 0.15) * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for k, w in BAS:
        if f * k > 2300:
            break
        a = att * (1 + 0.4 * (k - 1))
        on = np.sin(0.5 * np.pi * np.minimum(1, x / a)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) / (rel / (1 + 0.5 * (k - 1)))), 1.0)
        sig += w * on * off * np.sin(2 * np.pi * f * k * x + 0.7 * k)
    sig = sig + 0.35 * filt(sig.astype(np.float32), 'band', (480, 950))
    nd = int(min(sec, att * 1.6) * SR)
    if draw and nd > 64:
        e = np.sin(np.pi * np.arange(nd) / nd) ** 2
        sig[:nd] += draw * 0.04 * filt(R1.standard_normal(nd).astype(np.float32), 'band', (f * 0.85, min(2200.0, f * 3.2))) * e
    put(_held(filt(_tail(sig, n).astype(np.float32), 'low', 2300), room), s, g * BL, pan)

# ---- the steel behind: the same steel, lower, ringing with no touch of its own. It swells in, holds at an even level while what woke
# it holds (a to b), and dies away; a little of the steel's colour (its second and third partials), no finger, nothing above 1.8 kHz
STL = ((1, 1.0), (2, 0.22), (3, 0.10))
def steel(m, a, b, g=1.0, pan=0.0, att=0.8, rel=1.2, room=0.3):
    f = hz(m); sec = max(0.4, b - a); n = int((sec + 5 * rel + 0.15) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    sig = np.zeros(n)
    for k, w in STL:
        if f * k > 1800:
            break
        off = np.where(x > sec, np.exp(-(x - sec) / (rel / (1 + 0.6 * (k - 1)))), 1.0)
        sig += w * off * np.sin(2 * np.pi * f * k * x + 0.4 * k)
    put(_held(filt(_tail(sig * on, n).astype(np.float32), 'low', 1800), room), a, g * SL, pan)

def touch(m, s, g=1.0, pan=0.0, ring=1.4, sec=0.6, low=12):
    """one new thing that fits the plan: a rod touched once, and the steel answers it an octave below, untouched"""
    bas(m, s, sec, g * 0.8, pan, att=0.25, rel=0.9)
    steel(m - low, s + 0.5, s + 0.5 + ring, g * 0.85, pan, att=0.6, rel=1.0)

def mark(s, g=1.0, pan=0.0, step=0.75, hold=1.4, top=EB):
    """the mark: a chord touched once, high; then the same chord an octave and two octaves below, ringing in the steel, untouched"""
    for i, m in enumerate(top):
        bas(m, s + 0.03 * i, 0.9, g * 0.62, pan + 0.25 * (i - 1), att=0.3, rel=1.1)
    for i, m in enumerate(top):
        steel(m - 12, s + step, s + step + hold, g * 0.62, pan + 0.2 * (i - 1), att=0.7, rel=1.2)
    for i, m in enumerate(top):
        steel(m - 24, s + 2 * step, s + 2 * step + hold + 0.5, g * 0.66, pan + 0.15 * (i - 1), att=0.8, rel=1.4)

# ---- the guides: a French horn, soft and low, one voice, no vibrato. Its upper partials speak a moment after its fundamental, a
# warm covered colour round 300 to 600 Hz, a breath as each note starts, and it ends with the breath, not cut off
HORN = ((1, 1.0), (2, 0.52), (3, 0.30), (4, 0.15), (5, 0.08), (6, 0.04), (7, 0.02), (8, 0.012))
def horn(m, s, sec, g=1.0, pan=-0.25, att=0.1, rel=0.3, room=0.32):
    f = hz(m); n = int((sec + 4 * rel + 0.15) * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for k, w in HORN:
        if f * k > 1700:
            break
        a = att * (1 + 0.18 * (k - 1))
        on = np.sin(0.5 * np.pi * np.minimum(1, x / a)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) / (rel / (1 + 0.25 * (k - 1)))), 1.0)
        sig += w * on * off * np.sin(2 * np.pi * f * k * x + 0.3 * k)
    sig = sig + 0.3 * filt(sig.astype(np.float32), 'band', (280, 620))
    nb = int(0.12 * SR); sig[:nb] += 0.03 * filt(R1.standard_normal(nb).astype(np.float32), 'band', (300, 1400)) * np.exp(-np.arange(nb) / SR / 0.03)
    put(_held(filt(_tail(sig, n).astype(np.float32), 'low', 1700), room), s, g * HL, pan)
def walk(notes, s, step=0.62, g=1.0, pan=-0.25, last=1.6):
    """the guides' few notes: a short phrase on the horn, each note joined to the next, the last one held"""
    for i, m in enumerate(notes):
        end = i == len(notes) - 1
        horn(m, s + step * i, last if end else step * 0.95, g * (1.0 if end else 0.9), pan)
def stopped(m, s, g=1.0, pan=0.0):
    """a horn note stopped by the hand in its bell: muted, thin and nasal, and short. A door that stays shut"""
    f = hz(m); sec = 0.4; n = int((sec + 0.7) * SR); x = np.arange(n) / SR
    sig = np.zeros(n)
    for k in range(1, 14):
        if f * k > 2300:
            break
        sig += (0.25 if k == 1 else 0.6 / k ** 0.4) * np.sin(2 * np.pi * f * k * x + 0.5 * k)
    a = np.sin(0.5 * np.pi * np.minimum(1, x / 0.05)) ** 2 * np.where(x > sec, np.exp(-(x - sec) / 0.09), 1.0)
    sig = filt((sig * a).astype(np.float32), 'band', (420, 2100))
    put(_held(filt(_tail(sig, n).astype(np.float32), 'low', 2300), 0.25), s, g * HL * 0.8, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft knock: a card or a page set down, a pane put in place"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a slip, a tag, a row lit, a tick"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet laid down, a page turned"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, or many small things at once"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a door that stays shut: a small lock, closed"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.010, pan=0.0):
    """a switch turned"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def strike(s, g=0.008, pan=0.0, sec=0.4):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def sea(s, sec=3.4, g=0.010, pan=0.0):
    """the sea at the landing: a low swell of water that rises and falls back, as a boat comes in"""
    x = tt(sec); X(filt(noise(sec), 'band', (80, 600))[:len(x)] * np.sin(np.pi * np.minimum(1, (x / sec) ** 0.6)) ** 2, s, g * FX, pan)

# =============================================================================================================================
# 1. The plan for the islands: the opening, with music all through it.
#    The Galápagos in the late 1960s: E-flat major, the low steel under the evening and three rods touched. Volcanic islands far out:
#    A-flat. Boats, more each year: B-flat major, and the sea as they come in. Scientists and guides afraid: C minor, and the horn,
#    the guides, comes in. Visitors anywhere: a rod for the nests, the iguanas and the sea lions. Nests trampled: C minor. A bird
#    gone for good: A-flat, one note left alone. Something has to change: B-flat, the horn holding. The plan, made once for the whole
#    park: the mark. Most of it closed: nothing but air. A few sites, each on its trail: two rods. A guide with every group: the horn
#    walks. The same rules for everyone: one note, and a tap for each rule. A new boat, guide and visitor: each one touch, answered an
#    octave below. 1982 and 2025: E-flat, the horn walking again. The university: G minor; one table at a time: C minor, touched one by
#    one, nothing answering; its grants designed once: the mark. A new table and a new person: each touched and answered. The title
#    card: E-flat, the low steel and the horn
I = lambda lid, word, off=0: W('islands', lid, word, off)
i0 = S0('islands')
sea(i0 + 0.2, 3.8, 0.010, -0.3)
steel(Eb2, i0 + 0.3, I('far', 'Volcanic', -0.4), 0.8, att=1.6, rel=1.2)
bas(Eb3, i0 + 1.0, 1.6, 0.7, -0.2, att=0.5, rel=1.3); bas(Bb3, i0 + 1.5, 1.4, 0.6, 0.1, att=0.45, rel=1.3)
bas(G4, I('place', 'nineteen sixties', 0.0), 1.2, 0.5, 0.25, att=0.4, rel=1.4)
tap(i0 + 0.7, 0.008, px(400))
# far out: the map, and its line drawn west from Ecuador; A-flat, then E-flat for the animals
knock(G('islands', 'far', 0.3), 0.010, px(1540), 220)
air(I('far', 'thousand', -0.3), 1.3, 0.006, px(1540), 160, 800)
steel(Ab2, I('far', 'Volcanic', -0.2), I('far', 'Ecuador', 0.5), 0.7, att=1.0, rel=1.0)
bas(Ab3, I('far', 'Volcanic', 0.0), 1.3, 0.55, -0.15); bas(C4, I('far', 'Volcanic', 0.4), 1.2, 0.5, 0.1)
bas(Eb4, I('far', 'animals', 0.0), 1.3, 0.5, 0.2)
# boats, more each year: the sea as they come in; B-flat major
sea(G('islands', 'boats', 0.1), 3.8, 0.011, px(1500)); sea(G('islands', 'boats', 1.7), 3.6, 0.009, px(1150))
steel(Bb2, I('boats', 'boats', -0.2), I('boats', 'each year', 1.2), 0.65, att=0.9, rel=1.0)
bas(D4, I('boats', 'more', 0.0), 1.0, 0.45, 0.2); bas(F4, I('boats', 'each year', 0.0), 1.2, 0.45, 0.3)
# scientists and guides afraid: C minor, and the horn comes in, the guides
steel(C3, I('fear', 'Scientists', -0.2), I('fear', 'feet', 0.8), 0.7, att=0.9, rel=1.0)
walk((G3, Eb3), I('fear', 'guides', 0.0), 0.7, 0.8, -0.3, last=1.4)
# visitors anywhere, a step from the nests, the iguanas and the sea lions: a rod for each, where each one is
steel(Ab2, I('anywhere', 'Visitors', -0.2), I('anywhere', 'sea lions', 0.9), 0.6, att=0.9, rel=1.0)
bas(Eb4, I('anywhere', 'nesting birds', 0.0), 0.6, 0.4, px(930)); bas(C4, I('anywhere', 'iguanas', 0.0), 0.6, 0.4, px(1320))
bas(G3, I('anywhere', 'sea lions', 0.0), 0.8, 0.45, px(380))
# nests trampled, the lava worn down: C minor, a sigh from E-flat to D; the coral carried off
steel(C3, I('harm', 'Nests', -0.2), I('harm', 'carried off', 0.8), 0.7, att=0.9, rel=1.0)
bas(Eb4, I('harm', 'trampled', 0.0), 1.0, 0.45, 0.1); bas(D4, I('harm', 'worn down', 0.0), 1.2, 0.42, 0.1)
bas(G3, I('harm', 'coral', 0.0), 1.0, 0.4, px(900))
# a bird gone for good: its wings, A-flat; and many live nowhere else: one note, left alone
air(G('islands', 'lost', 0.3), 1.6, 0.007, px(1200), 200, 900)
steel(Ab2, I('lost', 'Birds', -0.2), I('lost', 'nowhere else', 1.2), 0.65, att=0.9, rel=1.0)
bas(Eb4, I('lost', 'for good', 0.0), 1.2, 0.4, 0.2)
bas(C4, I('lost', 'nowhere else', 0.0), 1.6, 0.5, 0.0)
# something has to change, before the thousands come: the faint boats far off, one breath; B-flat, the horn holding
air(G('islands', 'change', 0.2), 2.2, 0.006, 0.0, 120, 700)
steel(Bb2, I('change', 'The islands', -0.2), G('islands', 'plan', -0.4), 0.75, att=1.2, rel=1.0)
horn(Bb2, I('change', 'rules', 0.0), 2.2, 0.75, -0.3)
bas(D4, I('change', 'thousands', 0.0), 1.4, 0.45, 0.2); bas(F4, I('change', 'thousands', 0.4), 1.4, 0.4, 0.3)
# the plan, made once for the whole park: its card, and the mark
paper(G('islands', 'plan', 0.4), 0.010, px(520), 0.45)
mark(I('plan', 'plans the visits once', 0.0), 1.0)
# most of the park closed: nothing but air as the zones go grey
air(G('islands', 'most', 0.2), 2.4, 0.006, 0.0, 120, 600)
# a few sites, each along its own marked trail: two rods as the trail is drawn
steel(Eb3, I('sites', 'open', -0.2), I('sites', 'marked trail', 1.0), 0.5, att=0.8, rel=1.0)
bas(G4, I('sites', 'A few sites', 0.0), 1.0, 0.4, px(1000)); bas(Bb4, I('sites', 'marked trail', 0.0), 1.2, 0.4, px(1300))
# every group with a trained guide: the horn walks up the chord
walk((Eb3, G3, Bb3), I('guide', 'Every group', 0.0), 0.62, 0.9, -0.25, last=1.8)
# the same rules for everyone: one note held under them, and a tap for each slip
steel(Eb3, I('rules', 'the same', -0.2), I('rules', 'take nothing', 1.0), 0.55, att=0.9, rel=1.0)
bas(Bb3, I('rules', 'same for everyone', 0.0), 1.2, 0.4, 0.0)
for w_ in ('keep', 'touch', 'feed', 'take'):
    tap(I('rules', w_, -0.15), 0.008, px(380))
# a new boat, a new guide, a new visitor: the boat comes in on the sea; each one touched, and answered an octave below
sea(G('islands', 'fits', -0.2), 3.4, 0.010, px(900))
touch(Bb4, I('fits', 'new boat', 0.0), 0.75, px(900), ring=1.0)
touch(G4, I('fits', 'new guide', 0.0), 0.75, px(700), ring=1.0)
touch(Eb5, I('fits', 'new visitor', 0.0), 0.7, px(600), ring=1.6)
# 1982: its card; E-flat, warm, the low steel under the near pristine sites
knock(G('islands', 'held', 0.3), 0.010, px(390), 230)
steel(Eb2, I('held', 'twenty-five thousand', -0.3), I('held', 'near pristine', 1.2), 0.7, att=1.2, rel=1.2)
bas(G3, I('held', 'visit', 0.0), 1.4, 0.45, -0.1); bas(Eb4, I('held', 'near pristine', 0.0), 1.6, 0.5, 0.15)
# the flamingos nesting again, after fourteen years: A-flat, rising, where they sit; their slip
steel(Ab2, I('flamingos', 'Flamingos', -0.2), I('flamingos', 'fourteen years', 1.0), 0.6, att=1.0, rel=1.0)
bas(C4, I('flamingos', 'nested again', 0.0), 0.9, 0.45, px(1500)); bas(Eb4, I('flamingos', 'nested again', 0.45), 0.9, 0.45, px(1560))
bas(Ab4, I('flamingos', 'nested again', 0.9), 1.6, 0.5, px(1620))
tap(G('islands', 'flamingos', 1.2), 0.008, px(400))
# 2025: its card; still on the trails, still with a guide: the horn walks again, another way
knock(G('islands', 'now', 0.3), 0.010, px(390), 230)
steel(Eb2, I('now', 'twenty twenty-five', -0.2), I('now', 'with a guide', 1.2), 0.55, att=1.2, rel=1.2)
walk((Bb2, Eb3, G3, Eb3), I('now', 'still on the trails', 0.0), 0.6, 0.85, -0.25, last=1.6)
# a university's data has visitors too: the hall comes in; G minor, a new place; its tables and groups
air(G('islands', 'too', -0.5), 1.4, 0.006, 0.0, 150, 800)
steel(G2, I('too', 'A university', -0.2), I('too', 'visitors too', 1.4), 0.55, att=0.9, rel=1.0)
bas(G3, I('too', 'data', 0.0), 1.4, 0.45, -0.1); bas(D4, I('too', 'visitors too', 0.0), 1.4, 0.45, 0.15)
tap(G('islands', 'too', 0.3), 0.008, px(1040)); tap(G('islands', 'too', 0.6), 0.008, px(420))
# one table at a time: C minor, each rod touched on its own and nothing answering; the grant to one table, the wait, and the reach
# to a table it shouldn't, a sigh from A-flat to G
steel(C3, I('opened', 'Opened', -0.2), I('opened', "shouldn't", 1.6), 0.55, att=0.9, rel=1.0)
bas(C4, I('opened', 'one', 0.3), 0.8, 0.45, px(800), rel=0.6)
bas(Eb4, I('opened', 'wait', 0.0), 1.6, 0.4, px(576), rel=0.7)
bas(Ab3, I('opened', "shouldn't", 0.0), 0.7, 0.45, px(800)); bas(G3, I('opened', "shouldn't", 0.6), 1.2, 0.4, px(800))
# its grants designed once, by area and role: the shelves set in place, and the mark
knock(G('islands', 'so', 0.3), 0.010, px(1180), 230)
mark(I('so', 'designed once', 0.0), 1.0)
# every person and every new table fits from its first day: the table set on its shelf, the person joining; each touched, answered
knock(G('islands', 'fitsdata', 1.3), 0.010, px(1420), 230)
touch(Bb4, G('islands', 'fitsdata', 1.2), 0.75, px(1420), ring=1.2)
touch(G4, G('islands', 'fitsdata', 1.8), 0.7, px(470), ring=1.4)
# the title card: E-flat, the low steel, three rods and the horn
tB = G('islands', 'breath', -0.1)
steel(Eb2, tB, E('islands') - 0.9, 0.7, att=1.2, rel=1.2)
bas(Eb3, tB + 0.1, 1.8, 0.55, -0.2, att=0.5); bas(Bb3, tB + 0.4, 1.6, 0.5, 0.0, att=0.5); bas(G4, tB + 0.7, 1.6, 0.45, 0.25, att=0.5)
horn(Eb3, tB + 0.5, 2.2, 0.7, -0.3)

# 2. One table at a time: the old catalog, C minor, two rods; the grants made by hand, three rods touched one by one, nothing
#    answering; the fifty-odd others drawn at once, one breath; the new table that waits, one note held and left; the list read
#    grant by grant, a page; the move into the area catalogs, E-flat coming back as the tables fly in; Mei's card, and her plan:
#    B-flat, waiting for the plan
O = lambda lid, word, off=0: W('one', lid, word, off)
o0 = S0('one')
steel(C3, o0 + 0.2, o0 + 2.4, 0.55, att=0.8, rel=1.0)
bas(C4, o0 + 0.3, 1.2, 0.5, -0.1, att=0.4, rel=0.9); bas(G3, o0 + 0.65, 1.2, 0.45, 0.1, rel=0.9)
knock(o0 + 0.9, 0.010, px(300), 230)
tap(O('giuc', 'groups', -0.3), 0.008, px(200))
th = G('one', 'hand', 0.4)
bas(Eb4, th, 0.5, 0.42, px(700), att=0.2, rel=0.5); bas(C4, th + 0.72, 0.5, 0.42, px(760), att=0.2, rel=0.5)
bas(G3, th + 1.44, 0.6, 0.42, px(820), att=0.2, rel=0.6)
tap(O('count', 'Fifty-eight', -0.1), 0.008, px(1260)); tap(O('count', 'hundred', -0.2), 0.008, px(1520))
air(G('one', 'count', 0.2), 2.8, 0.007, px(900), 200, 1100)
bas(Eb4, O('wait', 'waited', 0.0), 2.0, 0.4, px(1000), att=0.5, rel=0.8)
tap(O('wait', 'new', 0.2), 0.008, px(1000))
knock(O('owned', 'nine', 0.3), 0.009, px(1000), 220); strike(O('owned', 'left', -0.1), 0.007, px(1000))
paper(G('one', 'say', -0.1), 0.009, px(330), 0.5)
tm = G('one', 'move', 0.7)
air(tm, 2.2, 0.007, 0.0, 150, 900)
steel(Eb3, tm - 0.1, tm + 3.4, 0.55, att=0.9, rel=1.0)
bas(Bb3, tm + 0.3, 0.8, 0.45, -0.2); bas(Eb4, tm + 0.65, 0.8, 0.45, 0.0); bas(G4, tm + 1.0, 1.2, 0.45, 0.2)
knock(G('one', 'mei', 0.3), 0.010, px(790), 230)
tap(O('mei', 'a plan', -0.1), 0.008, px(790))
bas(Bb3, O('mei', 'a plan', 0.0), 1.0, 0.4, 0.1); bas(F4, O('mei', 'a plan', 0.4), 1.4, 0.4, 0.2)

# 3. Three doors to a table: the table, its schema, its catalog, three rods falling to E-flat; the room and its shelves; three doors
#    put in place; each right opening its door, rising; the islands' landing, trail and site, the horn's three notes with the three
#    dots; SELECT alone, the horn stopped in its bell and the lock; BROWSE, A-flat, open; the table's card, and asking for it
D = lambda lid, word, off=0: W('doors', lid, word, off)
bas(Bb4, D('levels', 'a table', 0.0), 0.6, 0.42, px(1290)); bas(G4, D('levels', 'a schema', 0.0), 0.7, 0.42, px(1130))
bas(Eb4, D('levels', 'a catalog', 0.0), 1.0, 0.45, px(980))
steel(Eb3, D('levels', 'a catalog', 0.3), D('levels', 'a catalog', 2.4), 0.5, att=0.8, rel=1.0)
tap(D('room', 'a room', -0.1), 0.008, px(1400)); tap(D('room', 'a shelf', -0.1), 0.008, px(1400))
for w_ in ('into the room', 'onto the shelf', 'into the table'):
    knock(D('three', w_, -0.1), 0.010, px(1200), 190)
bas(Eb4, D('names', 'Use catalog', 0.4), 0.7, 0.45, px(900)); bas(G4, D('names', 'use schema', 0.4), 0.7, 0.45, px(1214))
bas(Bb4, D('names', 'select', 0.4), 1.0, 0.45, px(1438))
steel(Eb3, D('names', 'select', 0.7), D('names', 'select', 3.0), 0.5, att=0.8, rel=1.0)
walk((Bb2, Eb3, G3), G('doors', 'trail', 0.3), 0.5, 0.8, -0.3, last=1.4)
stopped(Bb3, D('alone', 'opens nothing', 0.1), 1.0, px(944))
lock(D('alone', 'opens nothing', 0.1), 0.009, px(944))
bas(C4, D('browse', 'browse', 0.0), 1.2, 0.42, px(900))
steel(Ab2, D('browse', 'browse', 0.2), D('browse', 'browse', 2.2), 0.45, att=0.8, rel=1.0)
knock(G('doors', 'find', -0.2), 0.010, px(390), 230)
tap(D('find', 'ask for it', -0.2), 0.008, px(200))

# 4. Shelves by who reads them: the islands' map of where people may walk, the horn's two notes; the same shelves in every catalog;
#    each shelf named; support, with its lock, C minor; the groups, and a grant to a person struck out; core's readers, a rod and its
#    steel; exam support's, in C minor; never on one table, E-flat on the catalog and the shelf, and the line to one table struck
#    out; a table moved to another shelf, B-flat as it lands
H = lambda lid, word, off=0: W('shelves', lid, word, off)
walk((Eb3, Bb2), H('start', "the islands' plan", 0.0), 0.7, 0.75, -0.3, last=1.6)
knock(G('shelves', 'same', -0.1), 0.010, px(560), 220); air(G('shelves', 'same', 0.1), 1.6, 0.006, px(560), 150, 800)
tap(H('build', 'Staging', -0.1), 0.008, px(1100)); tap(H('build', 'intermediate', -0.1), 0.008, px(1100))
tap(H('core', 'reference', -0.1), 0.008, px(1100)); tap(H('core', 'published', -0.1), 0.008, px(1100))
lock(H('support', 'support', 0.2), 0.009, px(1770))
steel(C3, H('support', 'support', 0.0), H('support', 'only a few', 1.2), 0.5, att=0.8, rel=1.0)
bas(Eb4, H('support', 'only a few', 0.0), 1.2, 0.4, px(1600))
air(G('shelves', 'groups', 0.2), 1.4, 0.006, px(200), 150, 800)
strike(H('groups', 'never', 0.0), 0.007, px(780))
touch(G4, H('office', 'core', 0.2), 0.7, px(1300), ring=2.4)
touch(C4, H('office', 'arrange', 0.2), 0.65, px(1600), ring=1.4)
tap(H('desk', 'help desk', 0.0), 0.008, px(500)); tap(H('desk', 'Planning', 0.0), 0.008, px(500))
tap(H('desk', 'policies', -0.2), 0.008, px(1520))
tap(G('shelves', 'team', 0.4), 0.008, px(370))
bas(Eb4, H('rule', 'a catalog', 0.0), 0.8, 0.42, 0.0); bas(Bb3, H('rule', 'a shelf', 0.0), 0.8, 0.4, 0.1)
steel(Eb3, H('rule', 'a shelf', 0.4), H('rule', 'a shelf', 2.0), 0.45, att=0.7, rel=1.0)
strike(H('rule', 'never', 0.45), 0.008, px(1400))
air(G('shelves', 'another', 0.3), 1.8, 0.006, px(1300), 160, 800)
knock(G('shelves', 'another', 2.1), 0.010, px(1400), 230)
bas(F4, G('shelves', 'another', 2.1), 0.8, 0.4, px(1400)); bas(Bb4, G('shelves', 'another', 2.45), 1.2, 0.4, px(1400))

# 5. A table built tomorrow: a grant on a shelf reaches every table on it, the mark, the steel ringing on as tomorrow's place waits;
#    the new credential table set down, and lit with no touch of its own; nobody asks, nothing plays; the exam support table on its own
#    shelf, C minor; the readers of core who never reach it, the horn stopped in its bell; a new boat at the islands, the horn's two
#    notes and the sea
M = lambda lid, word, off=0: W('tomorrow', lid, word, off)
mark(M('reach', 'reaches', 0.0), 1.0, step=0.9, hold=1.6)
knock(G('tomorrow', 'version', 1.5), 0.010, px(1706), 230)
steel(G3, M('version', 'first minute', 0.0), M('version', 'first minute', 2.0), 0.6, att=0.6, rel=1.0)
tap(M('version', 'first minute', -0.3), 0.008, px(1400))
tap(G('tomorrow', 'asks', 0.1), 0.008, px(1400))
knock(G('tomorrow', 'exam', 1.5), 0.010, px(1290), 230)
bas(C4, M('exam', 'only those', 0.0), 1.0, 0.42, px(1700))
steel(C3, M('exam', 'only those', 0.5), M('exam', 'only those', 2.3), 0.45, att=0.7, rel=1.0)
stopped(G3, M('never', 'none of them', 0.1), 1.0, px(962))
sea(G('tomorrow', 'boat', -0.1), 3.0, 0.009, px(770))
walk((Bb2, G3), M('boat', 'new boat', 0.0), 0.7, 0.8, -0.3, last=1.8)

# 6. Owners who don't leave: the owners' chips, B-flat; the owner's card and its slips; the catalog handed to a group, A-flat touched
#    once and every chip ringing it as the light reaches it; registrar-loader's badge; someone leaves, struck out, and the group's
#    chord rings on, no table without its owner; Mei; two kinds of owner, two rods a fifth apart
N = lambda lid, word, off=0: W('owners', lid, word, off)
n0 = S0('owners')
steel(Bb2, n0 + 0.4, n0 + 2.6, 0.45, att=0.8, rel=1.0)
bas(Bb3, n0 + 0.5, 1.2, 0.42, -0.1); bas(D4, n0 + 0.85, 1.2, 0.4, 0.1)
knock(N('any', 'catalog', -0.1), 0.009, px(1792), 220)
knock(N('any', 'the owner', -0.2), 0.010, px(390), 230)
tap(N('any', 'even', -0.2), 0.008, px(390)); tap(G('owners', 'first', -0.1), 0.008, px(390))
air(G('owners', 'first', 0.0), 1.0, 0.005, px(1500), 150, 800)
tg = N('group', 'a group', -0.2)
knock(tg, 0.010, px(200), 230); air(tg + 0.3, 1.7, 0.006, px(1300), 150, 900)
for i, m in enumerate((Ab3, C4, Eb4)):
    bas(m, tg + 0.3 + 0.03 * i, 0.8, 0.45, -0.4 + 0.2 * i, att=0.3, rel=1.0)
steel(Ab2, tg + 1.15, N('group', 'registrar owners', 1.6), 0.5, 0.3, att=0.7, rel=1.1)
steel(Eb3, tg + 1.3, N('group', 'registrar owners', 1.6), 0.4, 0.5, att=0.7, rel=1.1)
tap(G('owners', 'member', -0.1), 0.008, px(500))
knock(N('member', 'registrar loader', -0.2), 0.010, px(380), 230)
tap(N('member', 'builds', -0.1), 0.008, px(400)); tap(N('member', 'deploys', -0.1), 0.008, px(400))
strike(N('leaves', 'leaves', 0.3), 0.007, px(260))
tap(N('leaves', 'no table', -0.2), 0.008, px(140))
steel(Ab2, N('leaves', 'no table', 0.0), N('leaves', 'no one person', 0.6), 0.5, att=0.7, rel=1.0)
bas(Eb4, N('leaves', 'no table', 0.2), 1.2, 0.4, px(1500))
lock(N('leaves', 'no one person', 0.0), 0.008, px(140))
knock(G('owners', 'decides', 0.2), 0.010, px(795), 230)
tap(N('kinds', 'Mei says', 0.15), 0.008, px(795)); knock(N('kinds', 'the group', -0.2), 0.010, px(795), 230)
bas(Eb4, N('kinds', 'Mei says', 0.1), 1.0, 0.42, px(560)); bas(Bb3, N('kinds', 'the group', 0.1), 1.4, 0.42, px(795))
steel(Eb3, N('kinds', 'the group', 0.4), N('kinds', 'the group', 2.4), 0.45, att=0.7, rel=1.0)

# 7. Where it can be read from: the workspaces, G minor, a new place; the bridge from test cut, a lock; Anil's workspace and its three
#    switches turned off; the registrar's catalog bound there, read only, E-flat and its steel; the write that never happens, the horn
#    stopped in its bell, and MODIFY struck out; the study's own space; look, don't touch, as on the islands' trails: the horn
R = lambda lid, word, off=0: W('where', lid, word, off)
r0 = S0('where')
steel(G2, r0 + 0.3, r0 + 2.6, 0.45, att=0.8, rel=1.0)
bas(G3, r0 + 0.4, 1.2, 0.42, -0.2); bas(D4, r0 + 0.75, 1.2, 0.4, 0.1)
knock(R('bound', 'its own workspace', -0.2), 0.010, px(360), 230)
knock(R('bound', 'a grant', -0.3), 0.009, px(360), 210)
lock(R('bound', 'anywhere else', 0.4), 0.009, px(862))
knock(R('study', 'a workspace', -0.2), 0.010, px(380), 230)
click(R('study', 'downloaded', -0.1), 0.009, px(160)); click(R('study', 'copied out', -0.1), 0.009, px(160))
click(R('study', 'copied out', 0.2), 0.009, px(160))
air(G('where', 'readonly', 0.2), 1.0, 0.005, px(840), 150, 800)
bas(Eb4, R('readonly', 'read only', 0.0), 1.0, 0.42, px(839))
steel(Eb3, R('readonly', 'read only', 0.5), R('readonly', 'read only', 2.3), 0.42, att=0.7, rel=1.0)
stopped(Eb3, R('write', 'never write', 0.1), 1.0, px(839))
lock(R('write', 'whatever', 0.6), 0.009, px(960))
knock(G('where', 'space', -0.1), 0.010, px(720), 230)
knock(R('space', 'health progress', 1.1), 0.009, px(884), 220)
tap(R('space', 'made for', -0.2), 0.007, px(700)); tap(R('space', 'deleted', -0.2), 0.007, px(700))
walk((G3, Eb3), R('look', 'Look', 0.0), 0.8, 0.75, -0.3, last=1.8)

# 8. Written once, kept as code: E-flat, low, as GitHub's page comes in; the two files lit; the plan's lines; the data team's review, B-flat to
#    E-flat and its steel; the contract and its lines; the policies first, then the grant, a tick each; the path to production, three
#    rods rising with its ticks; Catalog Explorer, where nobody grants by hand, a lock; the admin account, switched on
C = lambda lid, word, off=0: W('code', lid, word, off)
c0 = S0('code')
steel(Eb2, c0 + 0.3, c0 + 2.8, 0.5, att=0.9, rel=1.0)
bas(Eb3, c0 + 0.5, 1.4, 0.42, -0.2); bas(Bb3, c0 + 0.85, 1.4, 0.4, 0.1)
knock(c0 + 2.4, 0.010, px(510), 230)
tap(C('files', 'two files', -0.2), 0.008, px(300)); tap(C('files', "the job's code", -0.2), 0.007, px(300))
paper(G('code', 'lines', -0.2), 0.009, px(510), 0.4)
tap(C('lines', 'a few lines', -0.2), 0.007, px(510))
tap(C('yes', 'reviews', -0.3), 0.007, px(500))
knock(C('yes', 'reviews', 0.3), 0.010, px(1430), 230)
bas(Bb3, C('yes', 'change', 0.1), 0.7, 0.42, px(1430)); bas(Eb4, C('yes', 'change', 0.55), 1.4, 0.45, px(1500))
steel(Eb3, C('yes', 'told', 0.3), C('yes', 'told', 2.3), 0.45, att=0.7, rel=1.0)
paper(G('code', 'contract', 0.1), 0.009, px(510), 0.4)
knock(C('contract', "agreement's contract", -0.2), 0.010, px(1430), 230)
air(C('contract', "agreement's contract", 0.1), 0.8, 0.005, px(980), 150, 800)
knock(C('after', 'policies', -0.2), 0.010, px(1430), 230)
tap(C('after', 'go in first', -0.1), 0.008, px(1100)); tap(C('after', 'its grant', 0.4), 0.008, px(1100))
knock(G('code', 'path', 0.3), 0.010, px(1430), 230)
bas(Bb3, C('path', 'test first', 0.2), 0.6, 0.4, px(1100)); bas(Eb4, C('path', 'says yes', 0.0), 0.7, 0.42, px(1100))
bas(G4, C('path', 'says yes', 0.7), 1.4, 0.45, px(1100))
steel(Eb3, C('path', 'says yes', 1.0), C('path', 'says yes', 2.8), 0.45, att=0.7, rel=1.0)
knock(G('code', 'byhand', -0.1), 0.010, px(510), 230)
lock(C('byhand', 'nobody', 0.0), 0.009, px(860))
knock(C('byhand', 'only', -0.2), 0.010, px(1430), 230); tap(C('byhand', 'one member', -0.2), 0.008, px(1100))
knock(G('code', 'admin', -0.1), 0.010, px(1430), 230)
click(C('admin', 'switched on', 0.1), 0.010, px(1720))
bas(Bb3, C('admin', 'switched on', 0.2), 1.0, 0.4, px(1600))
steel(Bb2, C('admin', 'switched on', 0.5), C('admin', 'switched on', 2.0), 0.4, att=0.7, rel=1.0)

# 9. Back to the islands: the sea, the low steel, and the horn walking up to E-flat, the last guide; the hall again; the registrar's
#    office, the study and everyone else lit in turn; a new table set down and a new person joining, a knock and a tap, the voice
#    alone; the film's idea, the mark; the end card: E-flat, the low steel, the horn and two rods
K = lambda lid, word, off=0: W('back', lid, word, off)
k0 = S0('back')
sea(k0 + 0.2, 3.6, 0.010, -0.2)
steel(Eb2, k0 + 0.4, K('islands', 'walked inside it', 0.6), 0.5, att=1.2, rel=1.0)
walk((Eb3, G3, Bb3, Eb4), K('islands', 'the plan came first', 0.0), 0.6, 0.85, -0.25, last=1.6)
air(G('back', 'here', -0.6), 1.2, 0.006, 0.0, 150, 800)
tap(K('who', "registrar's office", -0.2), 0.008, px(300)); tap(K('who', 'the study', -0.2), 0.008, px(300))
tap(K('who', 'everyone else', -0.2), 0.008, px(300))
knock(K('every', 'new table', 0.6), 0.010, px(1500), 230); tap(K('every', 'new person', 0.6), 0.008, px(400))
mark(K('idea', 'Design', 0.0), 1.0, hold=1.2)
tE = G('back', 'breath', 0.0)
steel(Eb2, tE, E('back') - 1.4, 0.65, att=1.2, rel=1.2)
horn(Eb3, tE + 0.3, 2.2, 0.7, -0.3)
bas(Bb3, tE + 0.6, 1.6, 0.45, 0.0, att=0.5); bas(G4, tE + 0.9, 1.6, 0.42, 0.25, att=0.5)
