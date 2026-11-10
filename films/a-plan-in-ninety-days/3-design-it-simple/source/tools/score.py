# Design it simple: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (/mnt/project-files/data-management/palettes.md: a lead the setup thread reserved on 5 November 2026,
# which no score on main or on any branch has and no other module's palette names, and a partner this film's thread chose on
# 10 November 2026): musical saws, made here, as music.py has none.
#  - The lead: a musical saw, a plain hand saw held between the knees, its blade bent into an S and bowed on its smooth edge. One blade
#    has every note in it: the bend chooses the note. The bow catches the edge, a soft grain of rosin is heard, and the blade swells
#    into one near-pure note and holds it. Each note is placed and then held still: no vibrato, no slide from note to note. To change
#    note, the player lifts the bow, damps the blade, bends it again and bows anew, so each saw sounds one note at a time. While the bow
#    is drawn, the note carries a little of the bow's own partials, exact multiples of it; when the bow lifts, the blade sings on alone,
#    purer, and dies away. Kept in the middle of the range (C 4 to F 5), and every note keeps the bow's grain at its start, so it can't
#    be taken for the site's ondes Martenot or its soft synthesisers.
#  - The partner, the thread's choice: a bass saw, a longer blade an octave lower (C 3 to C 4), bowed once and left to settle, with a
#    little more of the bow's partials, so a phone's small speaker still hears its note. Two saws, two players, two voices: the fewest
#    parts that serve the tune. Every other bowed, struck or plucked colour the site lacks either belongs to another culture or sounds
#    like one it has (palettes.md; the search: "musical saw", "bass saw", "bowed saw" and "singing saw" in every score.py, music.py and
#    palettes file on main and on all 57 branches, and in every palettes.md under /mnt/project-files/, 10 November 2026: only this
#    module's own reservation, and other modules' notes that the musical saw is this module's).
#  - The mark: four plain notes on the lead saw, each placed and held still, the simplest tune that carries: C, F, E, F (up to the home
#    note, one step away, and home again). Always C 4, F 4, E 4, F 4, 0.9 s apart (so its notes never join into a figure played again):
#    at "morning", as the book's closing words say anyone can learn the letters within days; at "Five shapes made every letter", where
#    the principles meet the king's shapes; at "simple enough to explain", as every part of the design fits on a page; and under the
#    end card, with the bass saw's F 3 under its last note.
#  - F major for what is designed simply and works; D minor for the opening's problem (years to learn, the court, the wrong character)
#    and for the data's own (41 days, the copies at the edges, the change that waited); B flat major where people speak and a chapter
#    turns; C major for the map and for work that flows; A minor for an objection (Choe Manri's, the head of school's). Every chord is
#    tuned pure from F (just intonation, see hz()): F, B flat and C major, and D and A minor, are pure in this table; G with D, and G
#    with B flat, are not, and never sound together. Nothing Korean for Hangul (the module's palettes.md): no Korean instrument, scale
#    or tune; the saws play plain Western diatonic lines.
# The rules every film of the module keeps (palettes.md, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only from time to time: at a chapter's turn, under a moment on screen or in a pause
#    without words, never a bed or a drone under the voice; no figure played again soon after itself; music and effects no louder than
#    the governance films'.
#  - Nothing trembles or pulses: each note one bend of one blade, steady, with no vibrato, its partials harmonic; each damped before it
#    would ring into the next chapter where the next chapter's picture changes. No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears, as the script plans the picture (script.md, Picture); each one below
#    uses the same word and offset the pictures will (src/ds_scenes.js), so sound and picture stay together when the voice is re-timed.
#    A burst on screen (thousands of signs, 98 dots in 100, seven partners, about 40 people) is one soft sound, never one for each.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1443)  # this film's own randomness: the room, the rosin, the paper

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats. F, B flat and C
# major, and D and A minor, are pure in this table; G held with D, or with B flat, is not, and they never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 41, 12)
    return 87.30706 * 2 ** o * _JI[pc]
C3, D3, E3, F3, G3, A3, Bb3 = 48, 50, 52, 53, 55, 57, 58
C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5 = 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77

# ---- the levels: the two saws matched by loudness, as far under the voice as the module's other music; the effects about 12 dB
# under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LS, LB, FX = 0.052, 0.058, 4.0
LV = [1.0]

# a small room round the saws, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry over its held body
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR)); _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds, its held body), as a room lifts
    some pitches and hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- a bowed saw. rough is how hard the bow bites as it catches: 0.2 a plain note, more for a note leaned into
def _blade(f0, d, rough, big, top=2300):
    """one note: the blade bent to its pitch and bowed for d seconds, then singing on alone"""
    tr = 1.3 * (175 / f0) ** 0.3 if big else 1.0 * (349 / f0) ** 0.3       # how long it sings once the bow lifts
    sec = d + 3.2 * tr; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    ta = (0.17 if big else 0.13) + 0.06 * rough                              # the bow catching: a saw speaks slowly
    sw = (1 - np.exp(-x / ta)) ** 1.5                                        # a soft swell, never a click
    ring = np.where(x < d, 1.0, np.exp(-(x - d) / tr))                       # held while bowed, then singing on,
    ring *= np.clip((sec - x) / (0.6 * tr), 0, 1)                            # and gone to nothing at its end, never cut off
    ph = 2 * np.pi * f0 * x                                                  # one bend, one pitch: placed, then held still
    sig = np.sin(ph) * sw * ring
    # the bow's own partials, exact multiples of the note, so nothing beats; a touch more of them as the bow bites, then fewer as the
    # blade sings, and they leave soon after the bow lifts. The bass saw has more of them, so a small speaker still hears its note
    bite = 1 + (0.6 + rough) * np.exp(-x / 0.12)
    bowed = sw * bite * np.where(x < d, 1.0, np.exp(-(x - d) / (tr / 4)))
    for k, a in ((2, 0.13 if big else 0.07), (3, 0.06 if big else 0.025), (4, 0.025 if big else 0.0)):
        if a and k * f0 < top:
            sig += a * np.sin(k * ph + 0.4 * k) * bowed
    # the rosin's soft grain as the bow catches the blade's edge, near the note and gone as it sings; and a breath of it, far under the
    # note, while the bow is drawn
    lo, hi = max(140.0, 0.7 * f0), min(1900.0, 3.5 * f0)
    gr = filt(noise(sec + 0.02)[:n], 'band', (lo, hi)); gr = gr / max(1e-9, float(np.abs(gr).max()))
    tg = 0.05 + 0.04 * rough
    held = np.clip((d - x) / 0.1, 0, 1)
    sig += ((0.06 + 0.05 * rough) * (x / tg) * np.exp(1 - x / tg) + 0.015 * sw * held) * gr
    return sig.astype(np.float32)

_V = {'lead': [], 'bass': []}   # each saw's notes; one blade sounds one note at a time, so each is damped where the next is bent in
def _bow(m, s, g, pan, bow, rough, room, until, big):
    d = bow
    if until is not None:
        d = min(d, max(0.3, until - s - 0.6))
    sig = norm(filt(filt(_blade(hz(m), d, rough, big), 'low', 2300), 'high', 45 if big else 70))
    a = min(0.3, 0.5 * d)
    sig = _until(_room(sig, room, a, max(a + 0.2, d)), s, until)
    _V['bass' if big else 'lead'].append((s, sig, g * LV[0] * (LB if big else LS), pan))

def saw(m, s, g=1.0, pan=None, bow=1.2, rough=0.2, room=0.3, until=None):
    """the lead saw: bowed for bow seconds from s, then left to sing"""
    _bow(m, s, g, max(-0.3, min(0.3, (m - 67) * 0.02)) if pan is None else pan, bow, rough, room, until, False)

def bass(m, s, g=1.0, pan=None, bow=1.6, rough=0.2, room=0.3, until=None):
    """the bass saw, the partner: a longer blade an octave lower, bowed once and left to settle"""
    _bow(m, s, g, -0.12 if pan is None else pan, bow, rough, room, until, True)

def _flush():
    """the two saws' notes onto the music bus, in time order; where a saw's next note is bent in, the player has damped the last"""
    for v in _V.values():
        v.sort(key=lambda z: z[0])
        for i, (s, sig, g, pan) in enumerate(v):
            if i + 1 < len(v):
                n = max(0, int((v[i + 1][0] - s) * SR))
                if n < len(sig):
                    sig = sig[:n].copy(); f = min(n, int(0.08 * SR))
                    if f:
                        sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
            if len(sig):
                put(sig, s, g, pan)

# ---- what they play
def line(notes, s, g=1.0, step=1.0, last=1.8, until=None):
    """a few notes on the lead saw, each placed and held still, then the next: never slid"""
    for i, m in enumerate(notes):
        saw(m, s + step * i, g, None, last if i == len(notes) - 1 else step - 0.1, until=until)

def two(lo, hi, s, g=1.0, gap=0.3, bow=1.6, until=None):
    """the two saws together: the bass saw's note, and the lead's a moment later"""
    bass(lo, s, g, None, bow, until=until)
    saw(hi, s + gap, g, None, max(0.5, bow - gap), until=until)

MARK = (C4, F4, E4, F4)
def mark(s, g=1.0, step=0.9, last=2.2, under=None, until=None):
    """the mark: four plain notes on the lead saw, each placed and held still: the simplest tune that carries. under: the bass saw's
    note with the last of them, where the film ends"""
    for i, m in enumerate(MARK):
        saw(m, s + step * i, g, 0.0, last if i == len(MARK) - 1 else step - 0.1, until=until)
    if under is not None:
        bass(under, s + step * (len(MARK) - 1), 0.85 * g, -0.12, last, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def sheet(s, g=0.0045, pan=0.0):
    """a sheet of thick paper laid flat or pinned to the wall: a soft flap, and the pin pressed home"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.24)[:n], 'band', (300, 1500)) * _bump(x, 0.09) * (x < 0.09)
    _fx(fl + 0.5 * _knock(n, 190, 0.012, 0.12) / 1.35, s, g, pan, 1800)
def card(s, g=0.004, pan=0.0):
    """a card set down: a short, soft pat of thick paper"""
    n = int(0.14 * SR); x = np.arange(n) / SR
    pt = filt(noise(0.16)[:n], 'band', (350, 1700)) * _bump(x, 0.05) * (x < 0.05)
    _fx(pt + 0.55 * _knock(n, 160, 0.016, 0.045) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0035, pan=0.0):
    """something small lit or set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 220, 0.012), s, g, pan, 1600)
def pen(s, sec=0.7, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def brush(s, sec=0.9, g=0.004, pan=0.0, n=3):
    """a soft brush laying ink on paper, a stroke at a time: a hushed, even sweep, lower and smoother than a pen"""
    for i in range(n):
        d = sec / n * R1.uniform(0.75, 0.95); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(filt(noise(d + 0.02)[:m], 'band', (260, 1200)) * _bump(x, d, 0.9), t, g, pan, 1500)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """a sheet slid along, a scroll unrolled or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def tiles(s, sec=1.0, g=0.0035, pan=0.0):
    """many small things laid out together: one soft texture of paper settling, that swells in and stops, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 18); gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1400)) * _bump(x, sec, 0.9) * gr, s, g, pan, 1600)
def book(s, g=0.0055, pan=0.0):
    """a closed book set down on a table: a low, soft thud, and its pages' faint breath"""
    n = int(0.35 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 95, 0.045) + 0.25 * filt(noise(0.37)[:n], 'band', (200, 900)) * np.exp(-x / 0.03), s, g, pan, 1000)

# =============================================================================================================================
# 1. Letters for everyone: the opening, the module's story from outside data. Korea, the 1440s: the bass saw's low F, alone, as morning
#    comes over the palace roofs; the lead's A, then C, for the kingdom. The sheet of characters and its thousands of signs, one soft
#    texture; A minor for a writing made for another language. Years to learn: D minor, low. The court: a brush writes the person's
#    words; the lead's A over the bass saw's D. The wrong character turns amber: the two saws' D, two octaves apart, stark, gone before
#    "Something had to change", which has nothing under it. The king starts from what people need: F major. The 28 letters drawn from
#    the mouth and throat, a brush stroke for each basic shape; a stroke added. The vowels' three marks, a note each: heaven the lead's
#    high C, the earth the bass saw's low F, a person the lead's A, between them. Syllable blocks. Choe Manri's scroll: A minor. The
#    king argues: B flat major; the book set down. The book's closing words: the mark, alone, as the morning comes up. Hangul today,
#    98 dots in 100 lit green: F major, bright. The turn to data: C major; the university's three amber pills, and the bass saw's low D
#    under "41 working days". The team's design, four parts: the lead's A and C. The title card: F major, held
LV[0] = 0.9
ow = lambda lid, word, off=0: W('letters', lid, word, off)
oc = lambda lid, off=0: G('letters', lid, off)
OEND = E('letters')
bass(F3, 0.3, 0.8, 0.0, bow=2.8)
line((A4, C5), ow('korea', 'Joseon', -0.2), 0.6, step=1.3, last=2.2)
# the sheet of characters laid down, filling with thousands of signs; A minor for a writing made for another language
sheet(ow('chars', 'characters', -0.1), 0.004, px(1240))
tiles(ow('chars', 'thousands', -0.1), 1.2, 0.003, px(1240))
two(A3, E4, ow('chars', 'another', -0.1), 0.55, bow=1.6)
# years to learn: D minor, low; the farmer's empty page
bass(D3, ow('years', 'years', 0.0), 0.6, bow=2.0)
saw(F4, ow('years', 'most', 0.2), 0.5, bow=1.4)
# the court: the clerk's brush writes the person's words in characters they can't read; the lead's A over the bass saw's D
brush(ow('court', 'written', -0.1), 1.0, 0.0035, px(820), 3)
saw(A4, ow('court', 'read', 0.0), 0.5, bow=1.2)
# the wrong character turns amber and is held in silence: the two saws' D, two octaves apart, gone before "Something had to change"
tap(ow('wrong', 'wrong', 0.0), 0.003, px(1180))
two(D3, D5, ow('wrong', 'wrong', 0.1), 0.5, gap=0.35, bow=1.6, until=oc('change', -0.3))
# the king starts from what people need: F major
two(F3, C5, ow('start', 'needed', 0.0), 0.55, gap=0.4, bow=1.8)
# the 28 letters drawn from the mouth and throat: a brush stroke for each basic shape as it draws itself, and the lead's A
card(oc('made', 0.1), 0.0035, px(460))
saw(A4, ow('made', 'twenty-eight', 0.2), 0.5, bow=1.4)
brush(ow('made', 'mouth', 0.0), 2.0, 0.0035, px(1200), 5)
# five basic shapes; a stroke added for a stronger sound
card(ow('shapes', 'Five', -0.1), 0.0035, px(1100))
brush(ow('shapes', 'stroke', 0.0), 0.3, 0.004, px(1300), 1)
# the vowels' three marks, a note for each: heaven high, the earth low, a person standing between them
for w, x in (('heaven', 1075), ('earth', 1275), ('person', 1475)):
    brush(ow('vowels', w, -0.1), 0.25, 0.0035, px(x), 1)
saw(C5, ow('vowels', 'heaven', 0.1), 0.5, bow=1.0)
bass(F3, ow('vowels', 'earth', 0.1), 0.55, bow=1.2)
saw(A4, ow('vowels', 'person', 0.1), 0.5, bow=1.2)
# syllable blocks: the marks come together, a block at a time; the lead's F
card(ow('blocks', 'syllable', 0.0), 0.0035, px(900)); card(ow('blocks', 'any', 0.0), 0.0035, px(1180))
saw(F4, ow('blocks', 'any', 0.2), 0.45, bow=1.2)
# Choe Manri's scroll unrolled: A minor
slide(ow('objected', 'Choe', -0.1), 1.0, 0.003, px(1300))
two(A3, E4, ow('objected', 'objected', 0.0), 0.5, bow=1.6)
# the king argues for his letters: B flat major; the book set down as it's published
bass(Bb3, ow('published', 'argued', 0.0), 0.55, bow=1.8)
saw(D5, ow('published', 'published', 0.0), 0.5, bow=1.4)
book(ow('published', 'book', -0.1), 0.005, px(1180))
# the book's closing words: the mark, alone, as the morning comes up behind the page
card(ow('morning', 'closing', -0.1), 0.0035, px(1180))
mark(ow('morning', 'morning', 0.0), 0.75)
# Hangul today: the name, then 98 dots in 100 lit green: F major, bright
card(ow('today', 'Hangul', -0.1), 0.0035, px(1100))
tiles(ow('today', 'ninety-eight', -0.1), 1.2, 0.003, px(1300))
two(F3, A4, ow('today', 'ninety-eight', 0.3), 0.55, bow=1.8)
# the turn to data: the letters give way to the university's plaster room; C major
two(C3, G4, ow('same', 'Data', 0.0), 0.55, gap=0.4, bow=1.8)
# the university, 2027: three amber pills; the bass saw's low D under "41 working days"
for w, x in (('eleven', 700), ('three', 960), ('forty-one', 1220)):
    card(ow('uni', w, -0.1), 0.0035, px(x))
bass(D3, ow('uni', 'forty-one', 0.2), 0.5, bow=1.4)
# the team's design, four parts lit one by one; the lead's A, then C as the front door lights
for w, x in (('five', 600), ('small', 840), ('six', 1080), ('front', 1320)):
    tap(ow('team', w, 0.0), 0.003, px(x))
saw(A4, ow('team', 'small', 0.1), 0.5, bow=1.0)
saw(C5, ow('team', 'front', 0.1), 0.5, bow=1.4)
# the title card: F major, held, gone as the next chapter comes in
bass(F3, oc('breath', 0.2), 0.7, bow=3.0, until=OEND)
saw(C5, oc('breath', 0.6), 0.55, bow=2.6, until=OEND)

# 2. Five principles: the chapter turns on B flat major, the bass saw's B flat under the lead's F, as Helena's wall comes in. The define
#    step lit. The five principle cards, one set down for each; the lead's A under the first, "start from the decision". Each card's
#    "rules out" line lit amber, and D minor for a principle nothing could fail. The two checks, a card and a tap each; the green answer
#    to the second, one list, F major. Then the five Hangul shapes beside the five cards: the mark
LV[0] = 0.9
rw = lambda lid, word, off=0: W('rules', lid, word, off)
two(Bb3, F4, S0('rules') + 0.2, 0.5, bow=1.6)
card(G('rules', 'define', 0.1), 0.0035, px(620))
card(G('rules', 'write', 0.1), 0.0035, px(1560))
for lid, w in (('p1', 'One'), ('p2', 'Two'), ('p3', 'Three'), ('p4', 'Four'), ('p5', 'Five')):
    card(rw(lid, w, -0.1), 0.0035, px(665))
saw(A4, rw('p1', 'decision', 0.1), 0.45, bow=1.2)
tap(rw('out', 'rules', 0.0), 0.003, px(1100))
two(D3, A4, END('rules', 'out', 0.1), 0.45, bow=1.4)
card(rw('why', 'map', -0.2), 0.0035, px(1560))
tap(rw('anyone', 'check', 0.0), 0.003, px(1560))
card(rw('tool', 'tool', -0.1), 0.0035, px(1560)); tap(rw('tool', 'platform', 0.0), 0.003, px(1560))
card(rw('copy', 'copy', -0.1), 0.0035, px(1560)); tap(rw('copy', 'One', 0.0), 0.003, px(1560))
two(F3, C5, rw('copy', 'everyone', 0.0), 0.45, bow=1.4)
mark(rw('shapes', 'Five', 0.0), 0.7, until=E('rules'))

# 3. The target, in five layers: the chapter turns on C major for Noor's map. Each page pinned, and one note as its picture completes,
#    down through F major from the top layer to the bottom: strategy the lead's C, business its A, information its F, application the
#    bass saw's C, technology its F. "Each page has its picture", a tap; the blue threads drawn from every system and copy to a decision,
#    and the two saws' F together, an octave apart. The two films' cards, set down
LV[0] = 0.9
tw = lambda lid, word, off=0: W('target', lid, word, off)
two(C3, E4, tw('map', 'map', -0.1), 0.5, bow=1.6)
for lid, w, m, big_ in (('strat', 'Strategy', C5, False), ('biz', 'Business', A4, False), ('info', 'Information', F4, False),
                        ('app', 'Application', C4, True), ('tech', 'Technology', F3, True)):
    sheet(tw(lid, w, -0.1), 0.004, px(620))
    (bass if big_ else saw)(m, END('target', lid, 0.1), 0.45 if not big_ else 0.5, None, 1.0)
tap(tw('pic', 'picture', 0.0), 0.003, px(1300))
slide(tw('together', 'Drawn', -0.1), 1.2, 0.003, px(1000))
two(F3, F4, tw('together', 'decision', 0.0), 0.45, bow=1.4)
card(tw('same', 'The', -0.1), 0.0035, px(800)); card(tw('product', 'promise', 0.0), 0.0035, px(1200))

# 4. A small team in the middle: the chapter turns on the bass saw's low D, as the worst of two designs comes in. The queue's amber card;
#    the three staff lists at the edges. The small team in the middle, a tap for each of its four jobs, and the lead's C as it helps.
#    The seven partners around it, one soft texture, and F major. A day a week; the leading data people module's card. The draft sent,
#    the head of school's letter back, and A minor. About 40 people at their spreadsheets, one texture. A partner's day, planned and
#    helped: F major. And the king's letters: B flat major, as he argued for them
LV[0] = 0.9
mw = lambda lid, word, off=0: W('team', lid, word, off)
bass(D3, mw('who', 'worst', -0.1), 0.5, bow=1.6)
card(mw('centre', 'forty-one', -0.1), 0.0035, px(480))
card(mw('edges', 'copies', -0.1), 0.0035, px(1440)); tap(mw('edges', 'disagree', 0.0), 0.003, px(1440))
card(mw('between', 'mesh', -0.1), 0.0035, px(1630))
for w, x in (('platform', 476), ('standards', 970), ('shared', 410), ('guardrails', 1000)):
    tap(mw('core', w, 0.0), 0.003, px(x))
saw(C5, mw('core', 'helps', 0.1), 0.45, bow=1.2)
tiles(mw('partners', 'Seven', -0.1), 1.4, 0.003, px(720))
two(F3, A4, END('team', 'partners', 0.1), 0.45, bow=1.4)
card(mw('day', 'day', -0.2), 0.0035, px(1630))
card(mw('ldp', 'leading', -0.1), 0.0035, px(1630))
slide(mw('draft', 'sends', -0.1), 1.0, 0.003, px(1400))
card(mw('draft', 'writes', -0.1), 0.0035, px(1390))
two(A3, E4, END('team', 'draft', 0.1), 0.45, bow=1.4)
tiles(mw('forty', 'forty', -0.1), 1.2, 0.003, px(530))
two(F3, C5, END('team', 'answer', 0.1), 0.45, bow=1.4)
bass(Bb3, mw('argue', 'argued', 0.0), 0.45, bow=1.4, until=E('team'))
saw(D5, mw('argue', 'letters', 0.0), 0.45, bow=1.2, until=E('team'))

# 5. A page for each: the chapter turns on C major as the six pages are laid out, one soft texture. The four roles, a tap each. The
#    page's picture draws itself, the work passing between the roles: C major, the lead's E. The front door: F major; its five
#    questions, a tap each as it appears; the opening date. Governance's card. Anil's spreadsheet, the build page followed a step at a
#    time; step four; the change that waited: D minor. Step four written again, a pen's strokes; tried by one partner, fixed before
#    everyone: F major
LV[0] = 0.9
pw = lambda lid, word, off=0: W('pages', lid, word, off)
tiles(G('pages', 'six', 0.2), 1.6, 0.003, px(960))
two(C3, G4, END('pages', 'six', 0.1), 0.45, bow=1.4)
for w in ('asks', 'steps', 'behind'):
    tap(pw('roles', w, -0.1), 0.003, px(520))
card(pw('picture', 'picture', -0.5), 0.0035, px(1400)); slide(pw('picture', 'picture', 0.0), 2.0, 0.003, px(1400))
two(C3, E4, END('pages', 'picture', 0.1), 0.45, bow=1.2)
card(pw('door', 'form', -0.1), 0.0035, px(1450))
two(F3, A4, pw('door', 'front', 0.0), 0.45, bow=1.4)
for w in ('What', 'By', 'Who', 'data', 'else'):
    tap(pw('q', w, 0.0), 0.003, px(1450))
tap(pw('opens', 'seventh', -0.3), 0.003, px(1450))
card(pw('gov', 'governance', -0.1), 0.0035, px(320))
tap(pw('tries', 'partner', -0.1), 0.003, px(700)); card(pw('anil', 'spreadsheet', -0.2), 0.0035, px(560))
card(pw('build', 'builds', -0.1), 0.0035, px(560)); tap(pw('build', 'page', -0.1), 0.003, px(1090))
tap(pw('step', 'Step', 0.0), 0.003, px(520))
card(pw('waited', 'four', -0.1), 0.0035, px(1600))
bass(D3, pw('waited', 'waited', 0.0), 0.5, bow=1.6)
saw(A4, pw('waited', 'everyone', 0.0), 0.45, bow=1.2)
pen(pw('fix', 'reviewer', -0.1), 0.9, 0.004, px(520), 3)
two(F3, C5, pw('tried', 'fixed', 0.0), 0.45, bow=1.6, until=E('pages'))

# 6. Simple enough to run: the milestone, F major; the whole design laid out, one soft texture, and a tap as each part lights. Every part
#    on a page: the mark. Anil, the first partner, a card. 1446 comes back: the opening's A, then C, over the bass saw's F, as the king's
#    letters return. Ask, build, check, a tap each. Next, a card. And the mark under the end card, the bass saw under its last note, then
#    F major, held, to the end
LV[0] = 0.9
uw = lambda lid, word, off=0: W('run', lid, word, off)
uc = lambda lid, off=0: G('run', lid, off)
tap(uw('milestone', 'milestone', 0.0), 0.003, px(960))
two(F3, A4, uw('milestone', 'milestone', 0.1), 0.45, bow=1.4)
tiles(uw('all', 'target', -0.1), 1.2, 0.003, px(380))
for w, x in (('principles', 670), ('small', 960), ('six', 1250), ('door', 1540)):
    tap(uw('all', w, 0.0), 0.003, px(x))
mark(uw('simple', 'simple', 0.0), 0.7)
card(uw('anil', 'Anil', -0.1), 0.0035, px(720))
bass(F3, uw('back', 'fourteen', 0.0), 0.5, bow=2.0)
line((A4, C5), uw('back', 'morning', -0.2), 0.45, step=1.3, last=1.6)
for w, x in (('ask', 700), ('build', 960), ('check', 1220)):
    tap(uw('uni', w, -0.1), 0.003, px(x))
card(uw('next', 'Next', -0.1), 0.0035, px(1530))
mark(uc('breath', 0.3), 0.7, last=2.4, under=F3, until=TOT)
saw(A4, uc('breath', 0.3) + 3 * 0.9 + 2.6, 0.45, bow=1.6, until=TOT)

_flush()
