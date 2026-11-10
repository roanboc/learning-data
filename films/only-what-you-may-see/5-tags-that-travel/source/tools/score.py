# Tags that travel: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette reserved for this film in the module's palettes (/mnt/project-files/data-protection/palettes.md, 5 November 2026, 17:58 UTC:
# "bray" and "octobass" in no score.py, music.py or audio.py on main or any branch, nor in any palettes list). Both are made here.
#  - The bray harp (bray()): the ordinary harp of Europe from about 1400 to the 1630s ("the ordinary harp", whose strings "rattle and
#    crackle", Praetorius, 1619). Each gut string is held at its foot by an L-shaped wooden pin turned to touch it, so every note that
#    string plays buzzes. Plucked softly with the fingers, one or two notes at a time, no vibrato, the buzz kept round and under 2.5 kHz.
#    A pin is set once, and every note of its string carries it: a class set once at the source, carried by everything made from it.
#    One string for each class, the strictest the lowest, as Know what you hold's bells: special A2, direct C3, pseudonymous E3,
#    indirect G3; a column with no class is a string held by a plain peg (A3), which rings plain, with no buzz.
#  - The octobass (octobass()): the giant bowed bass Jean-Baptiste Vuillaume made in Paris about 1850. One long, low note at a time
#    (A1 to G2), bowed softly, no vibrato, its top rolled off: the forest at the source under the opening, the floor held under the
#    moment two classes meet and the value set in advance applies, and the end. Never under the voice outside those moments.
#  - White notes only, as a diatonic harp has: A minor for the opening's problem, C major after. In this film's tuning (just
#    intonation from C) the chords of C, F, G, A minor and E minor are pure; no D is played, since with an A or an F it would beat.
#  - The film's mark (mark()): a short phrase from string to string, each note keeping its own buzz; then two buzzing notes meet, and
#    only the lowest is left, as the value set in advance: at the title card and at the end card.
# The module's rules (its briefs and the governance films' check, tools/quiet.py):
#  - Music under the opening story (the first chapter), with a rest where something has to change; no urgent pulse anywhere (film.json's
#    "urgent" is empty). After the opening, music only at a chapter's turn, under a moment on screen or in a pause without words, never
#    a bed under the voice: a class's string is plucked only as its chip lands, once.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js.
#  - Everything stays low and soft, below about 2.5 kHz; a figure isn't played again and again.

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
R1 = np.random.default_rng(1619)  # this film's own randomness: the room

# ---- tuning: just intonation from C, so the notes of a chord are whole-number ratios of each other and nothing beats
_JI = {0: 1, 4: 5 / 4, 5: 4 / 3, 7: 3 / 2, 9: 5 / 3, 11: 15 / 8}   # the white notes it plays: C, E, F, G, A and B (no D)
KEY = (48, 130.8128)  # C 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A1, C2, E2 = 33, 36, 40
A2, B2, C3, E3, F3, G3, A3, B3, C4, E4 = 45, 47, 48, 52, 53, 55, 57, 59, 60, 64
SPECIAL, DIRECT, PSEUDO, INDIRECT, PLAIN = A2, C3, E3, G3, A3   # each class's string, the strictest the lowest; PLAIN: no class

# ---- the levels, measured by tools/quiet.py as one speaker plays the score: the music's loud moments under -26.5 dB of full scale and
# its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
HL, BL, FX = 0.055, 0.065, 1.45

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. Its level is set by what it rings below lo
    (its gain there about one), not by all it rings: scaled by all of it, a room rings about 10 dB louder there than its share says"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum() * SR / (2 * lo))
ROOM = _ir(1.4, 1900)  # a hall of stone and glass, as the forest's night and the university's hall
def _body(s):
    """where a note is held, as the held-note check finds it: its 10 ms frames, smoothed over 0.1 s, within 3 dB of its own level
    after its first quarter second (from, to, in samples); None when it isn't held for half a second"""
    hop = SR // 100; n = len(s) // hop
    e = (np.asarray(s[:n * hop], np.float64).reshape(n, hop) ** 2).sum(1); lv = np.convolve(e, np.ones(10) / 10, 'same')[25:]
    if len(lv) < 50 or lv.max() <= 0:
        return None
    on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return (int(on[0] * hop), int((on[-1] + 1) * hop)) if len(on) >= 50 else None
def _room(s, wet):
    """the room round a note. Where the note is held, the room still moves its level, up or down by where its reflections meet the
    note's partials, so the note is set back there to the level it had before the room"""
    r = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    b = _body(s)
    if b:
        r = r * np.float32(np.sqrt((s[b[0]:b[1]] ** 2).mean() / max(1e-12, float((r[b[0]:b[1]] ** 2).mean()))))
    return r

# ---- the bray harp: string m plucked softly at t. A gut string, plucked by a finger a sixth of the way along it: its partials as such
# a pluck gives them, the finger's width softening the high ones; gut damps its high partials first, and the low strings ring longest.
# The bray pin stands just clear of the string at rest: while the string swings wide it strikes the pin once a cycle, and that touch
# is the buzz, which fades as the swing narrows and stops when the string no longer reaches the pin. It sounds with the string's own
# partials, adding to them (never cancelling them), 10 dB under the string as it starts; the touch is rounded and the buzz kept
# between 600 Hz and 2.1 kHz, so it stays round. buzz=0 is a string held by a plain peg, which rings plain; stop, when a hand
# damps the string (seconds after the pluck), as where two buzzing notes meet and only the lowest is left
def bray(m, t, g=1.0, pan=0.0, buzz=1.0, stop=None, room=0.22):
    f = hz(m); tau = 2.3 * (110.0 / f) ** 0.5; sec = min(4.0, 2.2 * tau) if stop is None else stop + 0.15
    n = int(sec * SR); x = np.arange(n) / SR
    snd = np.zeros(n); dis = np.zeros(n)
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        D = abs(np.sin(np.pi * k * 0.17)) / k ** 2 * np.exp(-(fk / 1700) ** 2)
        body = 0.75 + 0.35 * np.exp(-((fk - 260) / 140) ** 2) + 0.25 * np.exp(-((fk - 620) / 260) ** 2)
        dk = np.exp(-x / (tau / (1 + 0.55 * (k - 1) * f / 330)))
        snd += D * k * body * dk * np.sin(2 * np.pi * fk * x)
        dis += D * dk * np.cos(2 * np.pi * fk * x)
    if stop is not None:
        dmp = np.where(x > stop, np.exp(-(x - stop) / 0.035), 1.0); snd *= dmp; dis *= dmp
    snd *= np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    out = snd / max(1e-9, float(np.abs(snd[:int(0.1 * SR)]).max()))
    if buzz > 0:
        d = dis / max(1e-9, float(np.abs(dis[:int(0.05 * SR)]).max()))
        c = 0.06 * np.logaddexp(0, (d - 0.35) / 0.06)
        b = filt(filt(np.diff(c, prepend=0.0).astype(np.float32), 'band', (600, 2100)), 'low', 2100); w = int(0.3 * SR)
        out = out - buzz * 10 ** (-10 / 20) * b * np.sqrt((out[:w] ** 2).mean() / max(1e-18, float((b[:w] ** 2).mean())))
    fz = int(0.03 * SR); out[:fz] += filt(noise(0.04)[:fz], 'band', (300, 1400)) * np.exp(-x[:fz] / 0.006) * 0.02
    put(_room(filt(out.astype(np.float32), 'low', 2300), room), t, g * HL, pan)

# ---- the octobass: one long, low note from a to b, bowed softly. Its partials fall away as a bowed string's do, shaped by its huge
# body (resonances near 115 and 240 Hz), which gives out its lowest partial weakly, as a big bass does, and rolled off at the top; the
# bow sets it going slowly, the higher partials a moment after the first; it holds at one level with no vibrato, and when the bow
# lifts, the string rings a moment. A faint hiss of rosin under it
def octobass(m, a, b, g=1.0, pan=0.0, room=0.18):
    f = hz(m); sec = max(1.0, b - a); n = int((sec + 0.9) * SR); x = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, int(900 // f) + 1):
        fk = f * k
        w = (0.5 + 0.6 * np.exp(-((fk - 115) / 55) ** 2) + 0.45 * np.exp(-((fk - 240) / 110) ** 2)) / k ** 1.1 * np.exp(-fk / 650) * (0.5 if k == 1 else 1)
        on = np.sin(0.5 * np.pi * np.minimum(1, x / (0.45 + 0.04 * k))) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) / (0.3 / (1 + 0.15 * (k - 1)))), 1.0)
        s += w * on * off * np.sin(2 * np.pi * fk * x + 0.9 * k)
    s = s / max(1e-9, float(np.abs(s).max()))
    held = np.minimum(1, x / 0.5) * np.where(x > sec, np.exp(-(x - sec) / 0.2), 1.0)
    s = s + filt(noise(n / SR + 0.01)[:n], 'band', (160, 900)) * 0.006 * held
    put(_room(filt(s.astype(np.float32), 'low', 800), room), a, g * BL, pan)

def mark(t, g=1.0):
    """the film's mark: pseudonymous, then indirect, from string to string, each keeping its buzz; then direct and indirect meet, the
    hand damps indirect, and only the lowest, direct, is left"""
    bray(PSEUDO, t, 0.8 * g, 0.05); bray(INDIRECT, t + 0.45, 0.8 * g, 0.12)
    bray(DIRECT, t + 1.0, 0.9 * g, -0.05); bray(INDIRECT, t + 1.0, 0.75 * g, 0.12, stop=0.3)

# ---- the effects, soft and low, each where something happens on screen
def glass(s, g=0.015, pan=0.0):
    """a card of glass set down: a soft, round knock"""
    s_knock(s, g * FX, pan, 520)
def tap(s, g=0.008, pan=0.0):
    """a line set in place, a switch turned: a muffled tap"""
    s_tap(s, g * FX, pan)
def low(s, g=0.015, pan=0.0):
    """a coral pill set down, or something refused: a low, dull knock"""
    s_knock(s, g * FX, pan, 190)
def air(s, sec=0.8, g=0.009, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding across, a scan, a name frosting over, a door frosting shut"""
    s_air(s, sec, g * FX, pan, lo, hi)
def plank(s, g=0.014, pan=0.0):
    """a plank laid down: a soft, dull knock of wood, the board ringing a moment"""
    x = tt(0.3)
    sig = np.sin(2 * np.pi * 170 * x) * np.exp(-x * 24) + 0.5 * np.sin(2 * np.pi * 410 * x) * np.exp(-x * 40) + 0.25 * np.sin(2 * np.pi * 730 * x) * np.exp(-x * 70)
    X(norm(filt(sig.astype(np.float32), 'low', 1500)), s, g * FX, pan)

# =============================================================================================================================
# 1. From forest to shelf, the opening. The forest at night, the octobass's low A under it; the harp's A minor, one or two notes at a
#    time. The card of what is cut; the coral pill of the campaign. Two planks come up together, one note under them, and a question;
#    the line to the bare slope and the line to the forest end on the same note, as the two woods look the same. The cutting goes on,
#    a falling step; Rio, its card crossed out, and the octobass's A again. A rest for "Something has to change". Toronto: C major, the
#    octobass's C, a string for each group that meets; the council's open fifth. The chain: direct's string as the forest is certified,
#    then a string higher at each company the claim lands at; the label's two notes; where wood is mixed, two strings meet and only the
#    lowest is left. The numbers; the light back from the label to the forest, the strings back down to the source over the octobass's
#    C. The hall: two copies; a name that shows on a copy rings plain; with its class carried, direct's string on each copy. The mark
fw = lambda lid, word, off=0: W('forest', lid, word, off)
fc = lambda lid, off=0: G('forest', lid, off)
# the forest at the source: the octobass's A, and the harp's A minor opening out
octobass(A1, 0.3, fc('tell', -0.3), 0.9)
bray(A2, 0.9, 0.8, -0.1); bray(E3, 2.1, 0.75, 0.05); bray(A3, 3.4, 0.7, 0.15)
# cut much faster: the card; the campaign's coral pill
tMuch = fw('cut', 'much')
glass(tMuch + 0.15, 0.014, px(960))
bray(G3, END('forest', 'cut') + 0.2, 0.7, 0.1); bray(F3, END('forest', 'cut') + 0.65, 0.7, 0.0)
low(fw('boycott', 'campaign', 0.1), 0.013, px(820))
bray(E3, END('forest', 'boycott') + 0.15, 0.7, -0.05); bray(A3, END('forest', 'boycott') + 0.15, 0.6, 0.12)
# no buyer can tell: two planks come up together, one note under them; the question
tTell = fc('tell')
plank(tTell + 1.0, 0.012, px(820)); plank(tTell + 1.05, 0.012, px(1100))
bray(E3, tTell + 1.0, 0.75, 0.0)
tap(tTell + 0.95, 0.007, px(925)); bray(B3, tTell + 1.6, 0.6, 0.05)
# a forest cut bare, one cared for: each line ends on the same note
bray(E3, fw('same', 'cut bare', 0.75), 0.7, px(330)); bray(E3, fw('same', 'cared', 0.75), 0.7, px(1500))
# the cutting goes on: the octobass's A again; species, communities, a falling step
tGoes = fw('harm', 'goes')
octobass(A1, fc('harm', -0.3), END('forest', 'rio') + 0.6, 0.85)
tap(fw('harm', 'species', 0.1), 0.007, px(300)); tap(fw('harm', 'communities', 0.1), 0.007, px(300))
bray(F3, fw('harm', 'species', 0.35), 0.65, -0.1); bray(E3, fw('harm', 'species', 0.85), 0.65, -0.1)
bray(A2, fw('harm', 'communities', 0.6), 0.65, -0.15)
# Rio: its tag, its card, crossed out
glass(fw('rio', 'Rio', 0.05), 0.012, px(300)); glass(fw('rio', 'fail', -0.05), 0.014, px(390))
low(fw('rio', 'fail', 0.5), 0.013, px(650))
# "Something has to change": a rest. Toronto: C major, the octobass's C; a string for each group that meets
tTor = fc('toronto')
octobass(C2, tTor - 0.2, fc('council', 2.2), 0.85)
glass(tTor + 0.25, 0.014, px(760)); bray(C3, tTor + 0.3, 0.8, -0.05)
for k, (word, m) in enumerate((('forest and', E3), ('timber', G3), ('foresters', C4))):
    tap(fw('toronto', word, 0.05), 0.007, px(560)); bray(m, fw('toronto', word, 0.1), 0.7, -0.1 + 0.1 * k)
# the council: its card, an open fifth
tCo = fc('council')
glass(tCo + 0.25, 0.014, px(760)); bray(C3, tCo + 0.3, 0.75, -0.05); bray(G3, tCo + 0.3, 0.65, 0.1)
# the chain: the forest certified, direct's string; the claim lands at each company a string higher, as each tick lights
tCert = fw('auditor', 'certifies')
glass(tCert + 0.15, 0.014, px(350)); bray(C3, tCert + 0.25, 0.75, px(330))
tPass, tClaim = fc('passes'), fw('passes', 'passes the claim')
tap(tPass + 0.2, 0.007, px(330))
for k, m in enumerate((E3, G3, C4)):
    bray(m, tPass + 0.5 + (k + 1) * (tClaim - tPass - 0.5) / 3, 0.72, px((760, 1200, 1660)[k]) * 0.7)
# the label on the chair: its two notes
tLab = fw('label', 'carries')
glass(tLab + 0.05, 0.013, px(1400)); bray(C4, tLab + 0.15, 0.65, 0.3); bray(E4, tLab + 0.15, 0.55, 0.35)
# mixed by a rule set in advance: two strings meet, the hand damps the higher, and only the lowest is left
tRule = fw('mixed', 'rule')
air(tRule - 0.2, 0.7, 0.007, px(1385), 150, 700)
bray(C3, tRule + 0.3, 0.75, 0.25); bray(E3, tRule + 0.3, 0.65, 0.3, stop=0.32)
# the numbers: forest certified, certificates along the chain
tH1 = max(fc('hectares', 1.3), fw('hectares', 'hundred', -0.1)); tH2 = max(fw('hectares', 'sixty-eight', -0.1), fc('hectares', 2.2))
glass(tH1 + 0.15, 0.014, px(690)); bray(G3, tH1 + 0.25, 0.65, -0.2)
glass(tH2 + 0.15, 0.014, px(1250)); bray(C4, tH2 + 0.25, 0.65, 0.2)
# a buyer can tell where the wood began: the light back from the label to the forest, the strings back down to the source, over the
# octobass's C
tBeg = fw('buyer', 'where the wood')
octobass(C2, tBeg - 0.5, fc('travels', -0.4), 0.8)
for k, (dt, m) in enumerate(((-0.2, C4), (0.66, G3), (1.14, E3), (1.8, C3))):
    bray(m, tBeg + dt, 0.68, px((1660, 1200, 760, 330)[k]) * 0.7)
# the hall: the learner table and two copies made from it
tTr = fc('travels')
glass(tTr + 0.3, 0.013, px(460))
tMade = fw('travels', 'into every')
glass(tMade + 0.75, 0.011, px(1480)); glass(tMade + 1.15, 0.011, px(1480))
# a name hidden at the source frosts over; on a copy it shows: a plain string, no buzz
air(fw('hidden', 'hidden'), 0.8, 0.007, px(460), 200, 900)
bray(PLAIN, fw('hidden', 'shows', 0.45), 0.7, px(1480), buzz=0)
# with its class carried, the name hidden on each copy too: direct's string, on each
tIf = fc('protected')
bray(DIRECT, tIf + 1.6, 0.7, px(1480) * 0.7); bray(DIRECT, tIf + 1.95, 0.65, px(1480) * 0.8)
# the title card: the mark
mark(fc('breath', 0.5), 0.9)

# 2. Governed tags: a soft open fifth at the chapter's turn. Mei's card from the last film; Sam's card; Databricks' Governed tags
#    opens; each class's value flies up into its row, and its string is plucked as it lands: special, direct, pseudonymous, indirect,
#    the strictest the lowest; none goes, no tag, a plain string. The levels, a tap each; the permissions card, the loader, and no
#    one by hand
gw = lambda lid, word, off=0: W('governed', lid, word, off)
gc = lambda lid, off=0: G('governed', lid, off)
g0 = S0('governed')
bray(C3, g0 + 0.6, 0.6, -0.1); bray(G3, g0 + 0.6, 0.5, 0.05)
glass(gc('named', 0.35), 0.013, px(640))
glass(gc('sam', 0.35), 0.013, px(1570))
air(gw('sam', 'governed'), 0.6, 0.007, px(650), 200, 1000)
for k, (word, m) in enumerate(zip(('special', 'direct', 'pseudonymous', 'indirect'), (SPECIAL, DIRECT, PSEUDO, INDIRECT))):
    bray(m, gw('four', word, 0.75), 0.7, px(1200 + 160 * k) * 0.6)
bray(PLAIN, gw('none', 'no tag', 0.2), 0.6, px(400), buzz=0)
for k in range(4):
    tap(gw('level', 'four', 0.9 + 0.3 * k), 0.007, px(1160 + 150 * k))
tap(gw('faculty', 'no values', 0.1), 0.007, px(420))
glass(gw('means', 'set only', 0.05), 0.013, px(650))
glass(gw('loader', 'loader', -0.05), 0.012, px(900))
low(gw('loader', 'nobody', 0.6), 0.012, px(900))

# 3. Found, then confirmed: Mei's card; the scan's page and its rows; the learner table, three proposals, a tap each; Mei confirms
#    them, and each class's string is plucked as its chip lands: direct, direct, indirect. The support table; exam support named
#    special, special's string; the owner adds the rest: direct and pseudonymous
nw = lambda lid, word, off=0: W('found', lid, word, off)
nc = lambda lid, off=0: G('found', lid, off)
n0 = S0('found')
glass(n0 + 0.55, 0.013, px(340))
air(nw('scans', 'Data', -0.2), 0.7, 0.007, px(1170), 200, 1000)
for k in range(3):
    tap(nw('scans', 'proposes', 0.2 + 0.35 * k), 0.007, px(1170))
glass(nc('finds', -0.05), 0.013, px(950))
for k, word in enumerate(('name', 'email', 'date')):
    tap(nw('finds', word, 0.1), 0.007, px(1100))
for k, (word, m) in enumerate((('direct', DIRECT), ('direct and', DIRECT), ('indirect', INDIRECT))):
    bray(m, nw('confirms', word, 0.15), 0.68, px(1100) * 0.6)
glass(nw('support', 'support table', -0.15), 0.013, px(1575))
bray(SPECIAL, nw('knows', 'special', 0.15), 0.7, px(1600) * 0.6)
tAdds = nw('decides', 'adds')
bray(DIRECT, tAdds + 0.1, 0.62, px(1100) * 0.5); bray(PSEUDO, tAdds + 0.28, 0.6, px(1100) * 0.5)
tap(tAdds + 0.5, 0.006, px(1100))

# 4. Once, in the project: the pull request; Jun's card; each line written, a tap; Mei approves, a soft knock as its green pill comes
#    in. The hall: dbt builds, and sets each class as a tag, each string plucked as its first column is tagged: direct, pseudonymous,
#    indirect; the faculty tag, a tap; the level; an old tag slides off; the next build: special, and back to direct
ww = lambda lid, word, off=0: W('written', lid, word, off)
wc = lambda lid, off=0: G('written', lid, off)
glass(ww('project', 'project', 0.1), 0.012, px(1270))
glass(wc('jun', 0.2), 0.012, px(340))
for i in range(8):
    tap(ww('jun', 'writes', 0.1 + 0.42 * i), 0.006, px(1000))
glass(ww('approves', 'approves', 0.55), 0.012, px(740))
glass(wc('build', 0.05), 0.012, px(1300))
tap(ww('build', 'build', 0.3), 0.007, px(1300))
tSets = ww('build', 'sets')
for k, m in ((0, DIRECT), (1, PSEUDO), (4, INDIRECT)):
    bray(m, tSets + 0.05 + 0.18 * k, 0.65, px(400) * 0.6)
tap(ww('last', 'faculty', 0.1), 0.007, px(400))
glass(ww('last', 'confidential', 0.1), 0.012, px(560))
air(ww('none', 'taken off', -0.1), 0.8, 0.007, px(500), 200, 900)
glass(wc('change', 0.0), 0.011, px(1300))
tNext = ww('change', 'next build')
bray(SPECIAL, tNext - 0.15, 0.62, px(1300) * 0.5); bray(DIRECT, tNext + 1.35, 0.58, px(1300) * 0.5)
glass(ww('start', 'first', -0.3), 0.012, px(900))

# 5. The class follows: Sam's dialog, its two switches; lineage drawn; the loader; the copy slides in; the classes ride along the lines,
#    and each string is plucked as its chip lands on the copy: pseudonymous, indirect. A policy reads only tags; Mei's ticks and the
#    level. The next day: Anil may read; his table slides in, and pseudonymous rides into it
ow = lambda lid, word, off=0: W('follows', lid, word, off)
oc = lambda lid, off=0: G('follows', lid, off)
o0 = S0('follows')
glass(o0 + 0.55, 0.012, px(650))
tap(ow('on', 'propagation', 0.35), 0.008, px(650)); tap(ow('on', 'faculty', 0.25), 0.008, px(650))
air(ow('lineage', 'lineage', -0.2), 1.4, 0.007, px(900), 150, 800)
glass(ow('copy', 'loader', 0.0), 0.012, px(900))
tap(ow('copy', "Health's", 0.1), 0.006, px(900))
air(ow('copy', "study's", -0.2), 1.0, 0.007, px(1400), 150, 800); glass(ow('copy', "study's", 0.65), 0.012, px(1550))
bray(PSEUDO, ow('arrive', 'learner code', 1.25), 0.68, px(1500) * 0.6)
bray(INDIRECT, ow('arrive', 'year of birth', 1.25), 0.64, px(1500) * 0.6)
glass(oc('see', 0.3), 0.011, px(830))
air(oc('see', 0.25), 1.8, 0.006, px(1550), 200, 1000)
glass(oc('checks', 0.1), 0.012, px(830))
for k in range(2):
    tap(ow('checks', 'checks', 0.3 + 0.3 * k), 0.007, px(1700))
glass(ow('checks', 'confidential', 0.1), 0.012, px(1700))
glass(ow('next', 'given', 0.55), 0.012, px(1000))
tap(ow('next', 'given', 1.2), 0.006, px(1250))
air(ow('anil', 'table', -0.3), 1.0, 0.007, px(1000), 150, 800)
bray(PSEUDO, ow('anil', 'carry', 1.05), 0.66, px(1100) * 0.6)

# 6. Two values for one tag: the Suppose card; lineage from the student number, its class waiting at the copy's edge, a tap; Mei's
#    file, its value flying in beside it. Two values for one tag: direct's and pseudonymous's strings meet, and the coral frame. The
#    platform can't choose: the octobass's low A comes in, the floor, and the value set in advance flies in over it: special's string,
#    the lowest, alone. The bin of mixed wood; special passed on; the code made at the source rides back to the copy and on,
#    pseudonymous's string each time. A level never travels: its card, two panes joined, a low knock for the conflict it would be;
#    Mei's call
cw = lambda lid, word, off=0: W('conflict', lid, word, off)
cc = lambda lid, off=0: G('conflict', lid, off)
glass(cc('suppose', 0.2), 0.013, px(930))
air(cw('suppose', 'student', -0.1), 1.0, 0.007, px(840), 150, 800)
tTwo, tSp = cc('two'), cw('default', 'special', 0.5)
tap(cw('bring', 'direct', 0.2), 0.007, px(1050))
glass(cw('file', 'file', -0.15), 0.012, px(830)); tap(cw('file', 'pseudonymous', 1.1), 0.007, px(1000))
bray(DIRECT, tTwo + 0.2, 0.6, px(1100) * 0.6, stop=3.1); bray(PSEUDO, tTwo + 0.2, 0.55, px(1100) * 0.6, stop=3.1)
low(cw('two', 'conflict', -0.1), 0.012, px(1080))
octobass(A1, cc('default', 0.3), tSp + 1.0, 0.8)
glass(cw('default', 'advance', -0.25), 0.012, px(850))
bray(SPECIAL, tSp, 0.7, px(1250) * 0.6, stop=2.4)
glass(cc('mixed', 0.15), 0.012, px(910))
bray(SPECIAL, cw('wrong', 'passes', 1.0), 0.6, px(1300) * 0.6)
glass(cw('once', 'owner', 0.05), 0.012, px(850))
glass(cw('beside', 'beside', 0.4), 0.012, px(950))
tEv = cw('beside', 'every')
bray(PSEUDO, tEv + 1.6, 0.62, px(1250) * 0.6); bray(PSEUDO, tEv + 2.6, 0.58, px(1350) * 0.6)
glass(cc('level', 0.35), 0.013, px(960))
glass(cc('level', 0.75), 0.011, px(510))
air(cc('join', 0.2), 1.2, 0.007, px(500), 150, 800)
glass(cc('join', 1.3), 0.011, px(1300))
low(cw('join', 'conflict', 0.1), 0.012, px(1500))
glass(cc('call', -0.05), 0.012, px(1350))

# 7. What doesn't travel: a file leaves through the door, its tag falls at the glass and it carries none, a plain string; downloads
#    off, the coral pill, the door frosts shut; tables and views; Anil's totals; Mei makes them public
sw = lambda lid, word, off=0: W('stays', lid, word, off)
scc = lambda lid, off=0: G('stays', lid, off)
air(scc('inside', 0.1), 1.2, 0.006, px(800), 150, 700)
air(scc('file', -0.1), 2.4, 0.007, px(1200), 150, 800)
bray(PLAIN, sw('file', 'no tag', 0.3), 0.62, px(1550) * 0.6, buzz=0)
low(sw('off', 'switched', -0.1), 0.012, px(1600)); air(sw('off', 'switched'), 0.9, 0.007, px(1600), 200, 1000)
glass(sw('follow', 'into tables', -0.25), 0.012, px(450))
glass(sw('totals', 'counted', -0.25), 0.012, px(1110))
glass(sw('public', 'Mei', 0.05), 0.012, px(1700))
glass(sw('public', 'public', 0.1), 0.011, px(1400))

# 8. Every link in the chain: the label glows, one string, the chapter's turn. The hall: each class named once at the source, its
#    three strings; carried along the lines, a breath of air; where two meet, special's string; the policy's frames. The end card: the
#    octobass's C, and the mark
hw = lambda lid, word, off=0: W('chain', lid, word, off)
hc = lambda lid, off=0: G('chain', lid, off)
h0 = S0('chain')
bray(C4, h0 + 0.5, 0.6, 0.25)
for k, m in enumerate((DIRECT, PSEUDO, INDIRECT)):
    bray(m, hw('once', 'once', -0.1 + 0.2 * k), 0.62, px(400) * 0.6)
air(hc('carries', 0.3), 1.6, 0.007, px(950), 150, 800)
glass(hw('carries', 'where two', -0.05), 0.012, px(900)); bray(SPECIAL, hw('carries', 'where two', 0.1), 0.62, px(900) * 0.6)
glass(hw('next', 'reads', 0.0), 0.011, px(900))
tFin = hc('tag', -0.15)
octobass(C2, tFin - 0.2, tFin + 5.8, 0.8)
mark(tFin + 0.4, 0.9)
