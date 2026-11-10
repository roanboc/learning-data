# Read by an agent: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette reserved for this film in the module's palettes (/mnt/project-files/data-quality/palettes.md, 5 November 2026), checked
# that day against every score.py on main and every palette in the project files: no film plays an early computer's pulse tones.
#  - The first voice (first()): the pulse tones of an early stored-program computer, as the first computers played tunes through their
#    loudspeakers in 1950 and 1951: a machine playing exactly what its program says. Square and plain, C4 to C5, one note at a time,
#    with a rough start (a click and a few uneven cycles as the loudspeaker catches), then an even level, and gone. Low and filtered
#    below 2.3 kHz, never a beep. It plays the checker and the agent: what they offer, confidently, as written.
#  - The second voice (second()): the machine's own second voice, the same pulse tones an octave lower (C3 to C4), its square edges
#    filtered round, below 1.6 kHz, a soft swell to an even level, then gone. It plays only after the first voice has played and a
#    person has read it, never with it: the reading. Never held under the voice.
#  - C major, A minor for the problem. The film's mark (mark()): the machine plays a short phrase as its program is written, one note
#    wrong (an F where the program means an E), and the phrase is left hanging; then the second voice, below, plays it right. Played in
#    turn, never both at once, so nothing beats. The machine plays the phrase right itself only once the data says what it means (the
#    agent's 38, in chapter 4).
# The module's rules (its palettes, 5 November 2026):
#  - Music under the opening story (film.json's "story"); after it, only at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed under the voice; no urgent pulse anywhere (film.json's "urgent" is empty). tools/quiet.py checks it.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js. No keys typed
#    (a burst of tiny sounds), and no computer beeps for the Cupertino story beyond the first voice's own plain tones.
#  - Everything stays low and soft, below about 2.5 kHz; a figure isn't played again and again; held notes at even levels (_held).

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
R1 = np.random.default_rng(1951)  # this film's own randomness: the room, the loudspeaker's catch, the paper

# the notes, by MIDI number: the first voice from C4 to C5, the second from C3 to C4
C3, D3, E3, G3, A3, C4, D4, E4, F4, G4, A4, C5 = 48, 50, 52, 55, 57, 60, 62, 64, 65, 67, 69, 72
# the mark's phrase as the program means it (G E C D E), and as the machine first plays it, with an F for the last E
MEANT = [G4, E4, C4, D4, E4]
WRONG = [G4, E4, C4, D4, F4]

# ---- the levels, measured by tools/quiet.py as one speaker plays the score: the music's loud moments about -28 dB of full scale and its
# loudest notes under -24, as the module's other films; the effects about 15 dB under the music (FX scales them all)
V1, V2, FX = 0.034, 0.056, 1.5

# a room round the machine: a plain office, ringing on for under a second, and nothing much above 1.5 kHz. Its level is set by what it
# rings under 1.5 kHz (its gain there about one, so `room` is its share); each held note is set back to its own level after it (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.018 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3000)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a held note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b
    seconds, once it has come in and before it lets go). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.25 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the pulse tone: a loudspeaker switched on and off by the machine, at the note's pitch. Its partials are a pulse wave's, sin(k pi d)
# / k (d, the share of each cycle it's on: a little under a half, so it isn't a pure square), each falling away above `roll` Hz and none
# above `top`, so its edges never bite
def _pulse(f, x, duty, top, roll):
    s = np.zeros(len(x))
    for k in range(1, int(top // f) + 1):
        a = np.sin(np.pi * k * duty) / k
        if abs(a) < 1e-4:
            continue
        s += a * (1.0 if f * k < roll else np.exp(-(f * k - roll) / 380)) * np.sin(2 * np.pi * f * k * x)
    return s / max(1e-9, float(np.abs(s).max()))

def first(m, a, b, g=1.0, pan=0.0, room=0.22):
    """one note of the first voice, m, from a to b: a click and a few uneven cycles as the loudspeaker catches, then the tone at an
    even level, and gone in 30 ms"""
    f = mf(m); sec = max(0.12, b - a); n = int((sec + 0.06) * SR); x = np.arange(n, dtype=np.float64) / SR
    # the rough start: the pitch wanders a little for the first 40 ms, as the loop that makes it settles
    wob = np.cumsum(R1.standard_normal(n) * np.exp(-x / 0.012)) / SR * 2 * np.pi * 60.0
    s = np.zeros(n)
    for k in range(1, int(2300 // f) + 1):
        ak = np.sin(np.pi * k * 0.44) / k
        if abs(ak) < 1e-4:
            continue
        s += ak * (1.0 if f * k < 1400 else np.exp(-(f * k - 1400) / 380)) * np.sin(2 * np.pi * f * k * x + k * wob)
    s = s / max(1e-9, float(np.abs(s).max()))
    on = np.minimum(1, x / 0.006); off = np.cos(0.5 * np.pi * np.clip((x - sec) / 0.03, 0, 1)) ** 2
    click = filt(noise(n / SR + 0.01)[:n], 'band', (220, 1400)) * np.exp(-x / 0.004) * 0.35
    sig = filt(((s * (1 + 0.12 * np.exp(-x / 0.015) * np.sin(2 * np.pi * 31 * x)) + click) * on * off).astype(np.float32), 'low', 2300)
    sig = filt(sig, 'high', 110)
    put(_held(sig, room, min(0.08, 0.3 * sec), sec), a, g * V1, pan)

def second(m, a, b, g=1.0, pan=0.0, room=0.3):
    """one note of the second voice, m, from a to b: the same pulse tone an octave lower, its edges filtered round, swelling softly
    to an even level, held, and gone"""
    f = mf(m); sec = max(0.3, b - a); n = int((sec + 0.25) * SR); x = np.arange(n, dtype=np.float64) / SR
    s = _pulse(f, x, 0.5, 1600, 700)
    on = np.sin(0.5 * np.pi * np.minimum(1, x / 0.11)) ** 2; off = np.cos(0.5 * np.pi * np.clip((x - sec) / 0.2, 0, 1)) ** 2
    sig = filt(filt((s * on * off).astype(np.float32), 'low', 1100), 'high', 70)
    put(_held(sig, room, min(0.2, 0.4 * sec), sec), a, g * V2, pan)

def play(voice, notes, t, d, g=1.0, pan=0.0, last=None, gap=0.04):
    """a phrase, one note after another, each d long (the last `last`), with a breath of gap between; it returns when it ends"""
    for i, m in enumerate(notes):
        dd = last if (last and i == len(notes) - 1) else d
        voice(m, t, t + dd, g, pan); t += dd + gap
    return t

def mark(t, g=1.0, pan=0.0):
    """the film's mark: the first voice plays the phrase as the program is written, its last note wrong and left hanging; then, after a
    breath, the second voice, below, plays it right"""
    t1 = play(first, WRONG, t, 0.22, g, pan, last=0.85)
    play(second, [m - 12 for m in MEANT], t1 + 0.55, 0.3, g, pan, last=1.2)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft knock: a card set down on the bench, a tag tied on"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a mouse clicked, a mark made, a line written"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.011, pan=0.0, sec=0.45):
    """a sheet of paper laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pages(s, sec=2.0, g=0.006, pan=0.0):
    """many pages, one soft texture that swells in and dies away, not a burst of flicks"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1600))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.7, g=0.007, pan=0.0):
    """a pen writing on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1900))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def strike(s, g=0.008, pan=0.0, sec=0.45):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def stamp(s, g=0.016, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding across"""
    s_air(s, sec, g * FX, pan, lo, hi)

# =============================================================================================================================
# 1. A Cupertino: the opening, music under it. The office, about 2000: the first voice plays up through C major as the screen wakes;
#    the checker marks the slip (a tap) and the writer clicks the word it offers. The word list on the desk: "but not cooperation", A
#    and E, the minor. The checker offers Cupertino and the writer takes it: the click, and the first voice plays the phrase with its
#    wrong note, left hanging. The NATO report: the page laid down, and the wrong word lit, A falling to F. Hundreds by 2006: the
#    pages, one soft texture. The three things that made it: a note for the confident machine, nothing for the gap, and the second
#    voice silent where nobody read after it; then "Something had to change", a pause. The translators' magazine, laid down; the
#    fault's name, the second voice's A. The warning, READ IT FIRST tied on: the second voice's E, the reading. The makers' fix: the
#    word written in, the pass mark. By 2007, the word typed and stamped right: the second voice plays the phrase as it's meant. The
#    university: the agent's 412, one confident note; 38 and the 374, a knock. The title card: the mark.
cw = lambda lid, word, off=0: W('cupertino', lid, word, off)
c0 = S0('cupertino')
play(first, [C4, E4, G4, C5], c0 + 0.7, 0.3, 0.8, px(860), last=1.0)
tap(cw('checker', 'marks', 0.1), 0.007, px(1000))
tap(cw('checker', 'one it does', 0.5) + 0.2, 0.008, px(1000))
paper(G('cupertino', 'lists', -0.25), 0.010, px(520), 0.5)
play(first, [A4, E4], cw('lists', 'not', -0.1), 0.34, 0.75, px(520), last=0.9)
tap(cw('typed', 'marked', 0.1), 0.007, px(980))
tTook = cw('took', 'took', 0.15)
tap(tTook + 0.2, 0.008, px(980))
play(first, WRONG, tTook + 0.55, 0.22, 0.8, px(900), last=0.9)
paper(G('cupertino', 'nato', -0.25), 0.011, px(730), 0.5)
play(first, [A4, F4], cw('nato', 'Cupertino', -0.2), 0.32, 0.7, px(730), last=1.0)
knock(cw('nato', 'guess', -0.2), 0.012, px(1580), 260)
pages(G('cupertino', 'hundreds', 0.05), 2.2, 0.005, px(700))
knock(cw('hundreds', 'hundreds', -0.1), 0.011, px(1580), 260)
first(C5, cw('gap', 'confident', -0.15), cw('gap', 'confident', 0.35), 0.7, px(410))
knock(cw('gap', 'confident', -0.15), 0.010, px(410), 260)
knock(cw('gap', 'gap', -0.15), 0.008, px(970), 220)
knock(cw('gap', 'nobody', -0.15), 0.010, px(1530), 260)
paper(G('cupertino', 'wrote', 0.0), 0.011, px(710), 0.5)
knock(cw('named', 'Cupertino effect', -0.4), 0.012, px(1520), 260)
second(A3, cw('named', 'Cupertino effect', -0.3), END('cupertino', 'named') + 0.5, 0.8, px(1520))
tRead = cw('warning', 'read', -0.3)
knock(tRead + 0.05, 0.012, px(1350), 300)
second(E3, tRead + 0.1, END('cupertino', 'warning') + 0.4, 0.8, px(1350))
pencil(cw('makers', 'added'), 0.8, 0.006, px(420))
tap(cw('makers', 'knew', -0.2), 0.008, px(470))
tReaders = cw('benefit', 'readers', -0.3)
stamp(tReaders + 0.05, 0.014, px(980))
play(second, [m - 12 for m in MEANT], tReaders + 0.4, 0.3, 0.85, px(980), last=1.2)
first(C5, cw('data', '412', -0.35), cw('data', '412', 0.45), 0.75, px(560))
knock(cw('fixed', '374', -0.3), 0.012, px(1540), 260)
mark(G('cupertino', 'breath', 0.6), 0.85, px(960))

# 2. 412, with confidence: the chapter's turn, one note; the printer's date, a card set down; Malia's question, and the agent's answer at
#    once, the first voice's confident C, as in the opening; her email drafted, a sheet laid down; she reads it again: the hold tag tied on,
#    and the second voice's A, the reading; the band and the March card set down; the chip "Doesn't fit what she knows"
aw = lambda lid, word, off=0: W('answer', lid, word, off)
a0 = S0('answer')
first(C4, a0 + 0.35, a0 + 0.95, 0.7, px(300))
knock(G('answer', 'weeks', 0.3), 0.012, px(520), 260)
first(C5, aw('answers', '412', -0.25), aw('answers', '412', 0.55), 0.75, px(560))
paper(aw('draft', 'drafts', -0.1), 0.010, px(550), 0.45)
tBefore = aw('again', 'before', -0.2)
knock(tBefore + 0.05, 0.011, px(780), 300)
second(A3, tBefore + 0.15, END('answer', 'again') + 0.5, 0.8, px(780))
knock(aw('fifth', 'fifth', 0.2), 0.011, px(550), 260)
knock(G('answer', 'march', -0.1), 0.011, px(550), 240)
tap(aw('fit', 'fit', -0.3), 0.007, px(330))

# 3. Empty meant two things: the empty dates lit, one note, E; the two cards set down; the column's description, a page; the agent reads
#    what's written, and the cut to the bench from above: the checker's Cupertino beside the agent's 412, the phrase with its wrong note,
#    left hanging; "part of the data", the description set down and the second voice's E; the standard's card; the two faults
ew = lambda lid, word, off=0: W('empty', lid, word, off)
first(E4, ew('counted', 'empty', -0.1), ew('counted', 'empty', 0.5), 0.65, px(530))
knock(G('empty', 'yet', -0.1), 0.011, px(300), 260)
knock(ew('paper', '374', -0.1), 0.011, px(750), 240)
paper(G('empty', 'said', 0.0), 0.009, px(540), 0.45)
play(first, WRONG, G('empty', 'cupertino', 0.05), 0.22, 0.75, px(700), last=0.9)
tPart = ew('part', 'part', 0.15)
knock(tPart, 0.012, px(550), 260)
second(E3, tPart + 0.1, END('empty', 'part') + 0.6, 0.75, px(550))
knock(ew('iso', 'understandability', -0.6), 0.011, px(1430), 260)
knock(ew('fault', 'fault', -0.5), 0.011, px(530), 260)
knock(ew('fault', 'description', -0.3), 0.011, px(1380), 240)

# 4. What empty means, written down: the chapter's turn, C rising to G; the student system's page, a tap; the new column slides in, a
#    breath of air; the description written row by row, a pen each time; dbt writes it on every run, a breath of air from page to page;
#    the word list's fix beside it, the pass mark; asked again, the agent answers 38 and the first voice plays the phrase right, as it's
#    meant, for the first time; Malia's email sent, a sheet; Jun's check, re-pointed and 76 struck to 7
ww = lambda lid, word, off=0: W('written', lid, word, off)
w0 = S0('written')
play(first, [C4, G4], w0 + 0.45, 0.32, 0.7, px(440), last=0.8)
tap(ww('noor', 'Noor', -0.2), 0.007, px(540))
air(ww('how', 'column', 0.0), 0.7, 0.007, px(1000))
for lid in ('means', 'emptyis', 'owner'):
    pencil(G('written', lid, -0.15), 0.6, 0.006, px(760))
air(ww('dbt', 'Unity Catalog', -0.4), 0.8, 0.007, px(960))
tap(G('written', 'lists', 0.4), 0.008, px(470))
t38 = ww('again', '38', -0.2)
play(first, MEANT, t38 + 0.1, 0.22, 0.75, px(560), last=1.0)
paper(G('written', 'writes', -0.1), 0.010, px(550), 0.45)
strike(ww('check', 'pointed'), 0.007, px(560))
strike(ww('check', 'become', -0.1), 0.007, px(400))

# 5. The agent proposes, people decide: Genie Code comes in, one note, D; its three lines written; the draft description with its hold
#    tag, and the second voice's D; the three proposals set down; the first stopped, a stamp; the third struck out; Malia's weekly
#    count set down; "people decide", the second voice falling from G to C
pw = lambda lid, word, off=0: W('proposes', lid, word, off)
first(D4, pw('asks', 'Genie Code', -0.3), pw('asks', 'Genie Code', 0.35), 0.7, px(1130))
for word in ('profiles', 'drafts', 'proposes'):
    tap(pw('does', word, -0.2), 0.007, px(400))
tDraft = G('proposes', 'draft', -0.2)
knock(tDraft + 0.05, 0.011, px(830), 300)
second(D3, tDraft + 0.1, END('proposes', 'draft') + 0.4, 0.75, px(830))
for i in range(3):
    knock(G('proposes', 'review', 0.1 + 0.3 * i), 0.009, px(450), 250)
stamp(pw('stop', 'stop', -0.1), 0.013, px(900))
strike(G('proposes', 'no', -0.1), 0.008, px(400))
knock(pw('count', 'count', -0.3), 0.011, px(450), 260)
play(second, [G3, C3], pw('decide', 'decide', -0.6), 0.5, 0.75, px(450), last=1.2)

# 6. Read it before you act: the email held, READ FIRST tied on, and the second voice's E; the four questions set down; the two films'
#    cards; the description, and the second voice's C under "its quality is the data's quality"
bw = lambda lid, word, off=0: W('before', lid, word, off)
b0 = S0('before')
knock(b0 + 0.65, 0.010, px(580), 240)
tReading = bw('spared', 'reading', -0.4)
knock(tReading + 0.05, 0.011, px(1100), 300)
second(E3, tReading + 0.15, END('before', 'spared') + 0.5, 0.75, px(1100))
for lid, word, x in (('read', 'count', 520), ('read', 'fit', 1400), ('ask', 'show', 520), ('ask', 'person', 1400)):
    knock(bw(lid, word, -0.3), 0.009, px(x), 250)
knock(bw('films', 'Context engineering', -0.3), 0.010, px(520), 260)
knock(bw('films', 'Context and memory', -0.3), 0.010, px(1400), 260)
tStep = G('before', 'step', 0.2)
knock(tStep, 0.011, px(960), 240)
second(C3, bw('step', 'quality is', -0.3), END('before', 'step') + 0.8, 0.75, px(960))

# 7. For a reader who can't ask: Monday, one note, G; the template's rows written; the two halves of the Cupertino's cure, the word list
#    with its pass mark and the menu with READ IT FIRST; then the takeaway and the end card: the mark, one last time
mw = lambda lid, word, off=0: W('monday', lid, word, off)
m0 = S0('monday')
first(G4, mw('monday', 'Monday', -0.3), mw('monday', 'Monday', 0.3), 0.65, px(300))
knock(mw('monday', 'table', -0.3), 0.010, px(460), 250)
pencil(G('monday', 'each', -0.1), 0.9, 0.006, px(1320))
knock(mw('fix', 'fix the data', -0.4), 0.010, px(460), 250)
knock(mw('let', 'agents', -0.3), 0.010, px(460), 250)
knock(mw('let', 'people', -0.3), 0.010, px(460), 250)
tap(mw('halves', 'complete', -0.2), 0.008, px(480))
knock(mw('halves', 'read what', -0.2), 0.011, px(1300), 300)
mark(G('monday', 'breath', 0.5), 0.8, px(960))
