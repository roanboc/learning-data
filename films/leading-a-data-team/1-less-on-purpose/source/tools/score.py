# Less, on purpose: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, the module's (palettes.md: the lead reserved for this film on 5 November 2026; the partner chosen by this film's thread
# on 10 November 2026): one bass drum, struck with felt, made here, as music.py has none.
#  - The lead: a bass drum struck with felt, tuned low (C2, about 65 Hz) and let ring short: one sound, used rarely, with silence round
#    it. Each stroke is the drum's head moving in a few of its own modes (the lowest strongest, the others weaker and gone sooner, as
#    felt damps them), a soft thump of air as the beater lands, and the hand that stops it a moment later. Every note is under 150 Hz
#    (C2 to A2, 65 to 110 Hz); the head's few higher modes, the shell's ring and the felt's landing stay under about 650 Hz, so a
#    phone's small speaker still hears each stroke.
#  - Its partner, the thread's choice: the same drum, its head pressed by the other palm while the felt strikes, so the note is a little
#    higher (up to a sixth, A2, 110 Hz) and stops sooner. One drum, two touches: the film's idea, less, but done well. Every other struck
#    colour the site lacks belongs to another culture or sounds like one the site has (the module's long list), as the module's other
#    threads found; wooden bowls, the first thought, would come close to temple blocks, and this film's fourth chapter is about two ideas
#    from Japan.
# The mark: a crowded figure that thins to one note. Many quick strokes, pressed, A minor's notes in a heap; then two, slower; then the
#    open drum alone, C. It is heard whole once at the end of the opening, as the many pages become the few and then the title card;
#    once, shorter, as the 60 alerts become 12; and once at the close. Between them the drum mostly plays single notes.
# C major, A minor for the problem. The pressed notes are tuned pure from C (just intonation, see hz()): C, D, E, G, A. No two notes are
#    ever held together, so nothing can beat. No chimes or beeps for GOV.UK, and nothing Japanese for kanso or lean (palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each stroke one note, steady after its first few hundredths of a second, no roll; each stopped before it
#    would ring into the next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/lo_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.2 kHz; the effects about 12 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(2010)  # this film's own randomness: the room, the paper, the felt

# ---- tuning: just intonation from C
_JI = {0: 1, 2: 9 / 8, 4: 5 / 4, 5: 4 / 3, 7: 3 / 2, 9: 5 / 3, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 36, 12)
    return 65.40639 * 2 ** o * _JI[pc]
C2, D2, E2, G2, A2 = 36, 38, 40, 43, 45

# ---- the levels: the open drum and the pressed one matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LD, LP_, FX = 0.145, 0.132, 4.4
LV = [1.0]

# a small room round the drum, ringing for under a second. Its level is set by what it rings where the notes are (its gain from 100 Hz
# to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- the drum's head: a few of a round membrane's modes (their ratios to the lowest, and how strongly a felt beater near the middle
# sets each one going), each settling from a hair sharp to its pitch in the first few hundredths of a second as the head's stretch
# eases; the higher ones fade sooner. bright (0 to 1): how much of the higher modes the stroke keeps
_MODES = ((1.0, 1.0), (1.594, 0.42), (2.136, 0.26), (2.653, 0.14), (3.156, 0.08))   # (0, 2) left out: it would sit 10 Hz from (2, 1) and beat
def _head(f0, x, t1, bright):
    sig = np.zeros(len(x))
    for r, a in _MODES:
        fk = f0 * r
        if fk > 420:
            break
        ph = 2 * np.pi * fk * (x + 0.02 * 0.035 * (1 - np.exp(-x / 0.035)))
        sig += a * bright ** (r - 1) * np.sin(ph) * np.exp(-x / (t1 / (1 + 1.4 * (r - 1))))
    return sig
def _felt(sec, n, lo=45, hi=380):
    """the felt landing: a soft, dull push of air, low-passed"""
    x = np.arange(n) / SR; q = filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * np.exp(-x / 0.012) * np.minimum(1, x / 0.003)
    return q / max(1e-9, float(np.abs(q).max()))

def drum(m, s, g=1.0, pan=0.0, ring=0.9, room=0.2, until=None):
    """the open drum, struck with felt at s and stopped by the hand ring seconds later"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.35; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _head(f0, x, 0.62, 0.95)
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.3 * _felt(sec, n, 60, 600)
    sig = sig.astype(np.float32); sig = sig + 0.5 * filt(sig, 'band', (150, 420))   # the shell, which a small speaker hears
    sig = _until(_room(norm(filt(filt(sig, 'low', 650), 'high', 32)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LD, pan)

def pressed(m, s, g=1.0, pan=0.0, ring=0.32, room=0.15, until=None):
    """the same drum with its head pressed by the other palm: a little higher, and stopped within about a third of a second"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.08, until - s - 0.2))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _head(f0, x, 0.26, 0.8)
    sig *= (1 - np.exp(-x / 0.005)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.26 * _felt(sec, n, 70, 650)
    sig = sig.astype(np.float32); sig = sig + 0.5 * filt(sig, 'band', (170, 480))
    sig = _until(_room(norm(filt(filt(sig, 'low', 700), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LP_, pan)

# ---- what it plays
def strokes(notes, s, g=1.0, step=0.5, times=None, pan=0.0, until=None):
    """a few strokes, a note at a time: C2 on the open drum, the others pressed"""
    for i, m in enumerate(notes):
        at = s + (times[i] if times else step * i)
        (drum if m == C2 else pressed)(m, at, g, pan, until=until)
CROWD = (A2, E2, G2, D2, A2, C2, E2, G2)
def mark(s, g=1.0, crowd=CROWD, step=0.13, thin=(E2, G2), tstep=0.6, gap=1.0, last=1.1, until=None):
    """the mark: a crowded figure (quick pressed strokes), two slower, then the open drum alone. Returns when the last note lands"""
    for i, m in enumerate(crowd):
        (drum if m == C2 else pressed)(m, s + step * i, g * (0.85 + 0.15 * (i % 2)), (i % 3 - 1) * 0.12, ring=0.22 if m != C2 else 0.3, until=until)
    t = s + step * len(crowd) + 0.3
    for i, m in enumerate(thin):
        pressed(m, t + tstep * i, g, 0.0, ring=0.34, until=until)
    t += tstep * (len(thin) - 1) + gap
    drum(C2, t, g * 1.05, 0.0, ring=last, until=until)
    return t

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0035, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.0032, pan=0.0):
    """something small set down, a pill or a tag: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.0035, pan=0.0):
    """cards drawn along, or lines closing up: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
def rustle(s, sec=2.0, g=0.003, pan=0.0):
    """many sheets moving at once, heard as one soft texture of paper that swells in and fades, never a crackle"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (350, 1700)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1800)
def box(s, g=0.004, pan=0.0):
    """an archive box set down on the floor: a dull, low knock with a little paper in it"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 95, 0.05) + 0.25 * filt(noise(0.32)[:n], 'band', (150, 700)) * np.exp(-x / 0.03), s, g, pan, 900)
def stack(s, g=0.0035, pan=0.0):
    """a stack of paper set on a table: a soft, short slump"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.22)[:n], 'band', (200, 1000)) * np.exp(-x / 0.03) * np.minimum(1, x / 0.004) + 0.4 * _knock(n, 130, 0.025), s, g, pan, 1300)
def click(s, g=0.003, pan=0.0):
    """a switch turned off: one small, dull click, low-passed"""
    n = int(0.06 * SR); x = np.arange(n) / SR
    _fx(0.7 * _knock(n, 330, 0.006) + 0.3 * filt(noise(0.08)[:n], 'band', (400, 1400)) * np.exp(-x / 0.004), s, g, pan, 1500)

# =============================================================================================================================
# 1. Do less: the opening, Britain 2010 to 2013. The drum alone as Britain is named; the wall of pages fills, a soft texture of paper,
#    and the crowd's figure, A minor's notes in a heap; at home, a single pressed A; the two pages, cards, and an E as they're seen to
#    differ; the cost: A, then E; nothing under "Something has to change". C major from the review on: the drum, open, as Martha Lane Fox
#    reports; E and G for her advice; the old pages into the box, one texture; the new team, the two stacks, what people searched for; the
#    sort, its texture and the need cards landing; "do less", the open drum alone; GOV.UK, one note; the tests, E and G; the award, a
#    small rising figure. A data team's pile: A minor again, a pressed A; stopped, the kept sheets drawn into a row; then the mark,
#    whole, as the six sheets become the title card: the crowd, two notes, and the open drum alone
LV[0] = 0.9
dw = lambda lid, word, off=0: W('doless', lid, word, off)
dc = lambda lid, off=0: G('doless', lid, off)
END = E('doless')
drum(C2, dw('when', 'Britain', 0.1), 0.8, 0.0, ring=0.8)
strokes((A2, E2, G2, A2, D2, E2), dw('pages', 'websites', 0.0), 0.62, step=0.15)
# at home, on an evening: a renewal, a tax, which site to trust; the same advice on two pages, in different words
pressed(A2, dc('need', 0.3), 0.7, 0.0, ring=0.34)
pressed(E2, dw('same', 'different', 0.1), 0.65, 0.0, ring=0.34)
# what the websites cost; then nothing under "Something has to change"
pressed(A2, dw('cost', '560', 0.2), 0.7, 0.0, ring=0.34); pressed(E2, dw('cost', '560', 1.3), 0.6, 0.0, ring=0.34)
# October 2010: the review, C major, the open drum; her advice; the old pages into the archive box, one texture
drum(C2, dw('review', 'Martha', 0.3), 0.75, 0.0, ring=0.9)
pressed(E2, dw('advice', 'website', 0.1), 0.6, 0.0)
pressed(G2, dw('advice', 'team', 0.1), 0.6, 0.0)
# 2011: the new team; the two old sites, page by page, and what people searched for
# the sort: most pages into the box, one texture; the few needs, landing one at a time; a single pressed G under "a real need"
_sort0, _sortD = dc('keep', 0.1), max(3.6, dc('rules') - dc('keep') - 0.8)
pressed(G2, dw('keep', 'need', 0.1), 0.55, 0.0)
# 2012: the principles; "do less", and the open drum alone
drum(C2, dw('rules', 'less', 0.4), 0.75, 0.0, ring=1.0)
# October 2012 to spring 2013: one site, one note; the few pages; the tests, E and G; the award, a small rising figure
drum(C2, dc('launch', 0.3), 0.75, 0.0, ring=0.9)
pressed(E2, dw('test', '61', 0.1), 0.55, 0.0); pressed(G2, dw('test', 'minute', 0.2), 0.55, 0.0)
strokes((C2, E2, G2), dw('award', 'Design', 0.2), 0.6, step=0.36)
# a data team's work piles up the same way: one texture, and a pressed A; stopped: the pile thins, the kept sheets drawn into a row
pressed(A2, dw('data', 'piles', 0.2), 0.6, 0.0)
# the mark, whole, as the six kept sheets become the title card; the open drum's last note is gone before the next chapter
mark(dc('breath', -1.4), 0.62, until=END)

# 2. Everything on one wall: the four ideas, a card each; the first kept, a pressed G; Helena's card; the wall filling, one texture; the
#    old reports, the meetings, the alerts, a tap for each number; most need nothing: a pressed A, alone; the three reasons; the study's
#    card, the ideas a few at a time, the one that took away ringed; chosen together: the open drum, then a pressed G
LV[0] = 0.9
ww = lambda lid, word, off=0: W('wall', lid, word, off)
wc = lambda lid, off=0: G('wall', lid, off)
pressed(G2, ww('first', 'minimalism', 0.1), 0.55, px(340))
pressed(A2, ww('alerts', 'nothing', 0.5), 0.55, 0.0)
strokes((C2, G2), ww('ask', 'together', 0.3), 0.6, step=0.55, until=E('wall'))

# 3. What each thing is for: the question; the reports people read, outlined; the three agreements, a card each; the week they design:
#    two cards, its parts a tap each; three hours instead of eight: E, alone, then the open drum
LV[0] = 0.9
uw = lambda lid, word, off=0: W('use', lid, word, off)
uc = lambda lid, off=0: G('use', lid, off)
pressed(E2, uw('hours', 'three', 0.0), 0.55, 0.0); drum(C2, uw('hours', 'eight', 0.5), 0.7, 0.0, ring=0.8, until=E('use'))

# 4. Stopped, openly: the week from Monday, the old one struck through; the board; the notes to the last readers, one texture; a copy
#    sent, a tick; the plan's card; the 17 switched off, a few soft clicks, and the open drum after "not deleted"; GOV.UK's archive box,
#    and G falling to C; the alerts sorted, one texture; the summary; and the mark, shorter, as 60 become 12; chosen together: the drum
LV[0] = 0.9
sw = lambda lid, word, off=0: W('stop', lid, word, off)
sc = lambda lid, off=0: G('stop', lid, off)
drum(C2, sw('off', 'deleted', 0.5), 0.7, 0.0, ring=0.9)
strokes((G2, C2), sw('gov', 'archived', 0.3), 0.6, step=0.62)
mark(sw('twelve', '12', 0.0), 0.5, crowd=(A2, G2, E2, A2, D2, G2), step=0.14, thin=(G2,), gap=0.9, last=0.9)
drum(C2, sw('choose', 'undone', 0.5), 0.65, 0.0, ring=0.8, until=E('stop'))

# 5. Less, but better: the three works, a card each, and one open stroke under "simplest"; the two ideas from Japan, two cards; nobody's
#    work called waste; the 17, one soft texture; Rams's card, and after "less, but better", the open drum alone; the kept sheets drawn in
LV[0] = 0.9
rw = lambda lid, word, off=0: W('roots', lid, word, off)
rc = lambda lid, off=0: G('roots', lid, off)
drum(C2, rw('art', 'simplest', 0.2), 0.65, 0.0, ring=0.9)
drum(C2, rw('rams', 'better', 0.5), 0.7, 0.0, ring=1.0)

# 6. The time back: June's card; the eight bars, a tap for every two; their gaps closing, a slide, and C with G under "one person's whole
#    week"; every alert now matters, a tick; the 21 onto the platform, one texture, their owners a pen; the rule's card and a pressed E; the
#    quarterly review, and the wall again
LV[0] = 0.9
tw = lambda lid, word, off=0: W('time', lid, word, off)
tc = lambda lid, off=0: G('time', lid, off)
strokes((C2, G2), tw('hours', 'whole', 0.2), 0.6, step=0.5)
pressed(E2, tw('rule', 'owner', 0.4), 0.55, 0.0)

# 7. On Monday: GOV.UK's plain page, and the open drum under "did it well"; Helena's two pills; the four things to do, a card each; the
#    next film; the last line's two pills; and the mark at the close, its last note the open drum alone as the end card comes
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
drum(C2, mw('back', 'well', 0.4), 0.7, 0.0, ring=0.9)
mark(mw('take', 'together', 0.6), 0.6, crowd=(E2, A2, G2, D2, E2, A2, G2), step=0.13, thin=(G2, E2), tstep=0.62, gap=1.1, last=1.3, until=TOT)

# ---- what the hands write: the boards and the pages of a notebook (the film made again in ink line, 18 November 2026). A row waits
# until whoever writes has walked to it (PK.pace), so the marker's and the pen's sounds ask the film when each row is written (the
# people kit's tools/pens.py). And the chats: a soft blip for each message that arrives
import pens
PEN = pens.written({'O': ('doless', 'carmen', 'lo_boardO'), 'A': ('wall', 'carmen', 'lo_boardA'), 'B': ('wall', 'helena', 'lo_boardB'),
                    'C': ('use', 'carmen', 'lo_boardC'), 'D': ('roots', 'carmen', 'lo_boardD'), 'E': ('time', 'helena', 'lo_boardE'),
                    'M': ('monday', 'helena', 'lo_boardM'), 'N1': ('wall', None, 'lo_note1'), 'N2': ('use', None, 'lo_note2'),
                    'N3': ('time', None, 'lo_note3')})
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 40)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1300)) * _bump(x, d, 0.7) * (0.4 + 0.6 * gr), t, g, pan, 1500)
def scratch(s, sec=0.7, g=0.004, pan=0.0, n=3):
    """a pen on a notebook's page, a word at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (600, 1800)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 1900)
def written(name, hand, g, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row and each long mark, a word at a time"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def pop(s, g=0.0022, pan=0.0, up=True):
    """a message sent (up) or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)


for name in ('O', 'A', 'B', 'C', 'D', 'E', 'M'):
    written(name, marker, 0.004)
for name in ('N1', 'N2', 'N3'):
    written(name, scratch, 0.004)
# the chat: Ivy's message to a report's last reader as it goes, and the answer as it arrives
pop(G('stop', 'write') + 1.0 + 1.6, 0.0022, px(400), True)
pop(G('stop', 'reply') + 1.6 + 1.4, 0.0022, px(400), False)
