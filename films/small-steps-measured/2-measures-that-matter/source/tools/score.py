# Measures that matter: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026, 03:58 UTC, after searching every
# score.py and music.py on main and on all 57 branches, and every palettes.md in the project's files, for "pitch pipe", "pitchpipe",
# "graduated stopper" and "boxwood": none): a wooden pitch pipe, made here, as music.py has none.
#  - The pitch pipe: the small square pipe of boxwood that choirs and singing schools blew before tuning forks were common. A plunger
#    slides inside it, and its rod is marked with the notes of the scale: set the plunger to a mark, blow, and everyone starts from that
#    one note. A stopped pipe: hollow and dark, its odd partials only, a small breath at each note's start, then held at one level until
#    the breath stops. Each note is set on its mark before it is blown, so nothing slides, and nothing trembles.
#  - Its partner: a larger pitch pipe, an octave lower, that gives the baseline. It plays one note, low C, set before anything changes,
#    and blown again wherever a measure is read against where it started.
#  - One small pipe blown by mouth: no room round it, no wind chest. Nothing of the opening's world: no heartbeat, no monitor's beep,
#    nothing of a hospital or of New York in 1952.
# The mark: five notes, each on one of three marks of the stopper (0, 1 and 2 are E, G and high C), as the score has five signs, each
# scored 0, 1 or 2: 0, 1, 2, 1, 2, landing on high C over the baseline's low C. It is played whole when Apgar proposes her score, whole
# again back in New York at the end, and at the close an octave lower, its last note held into the end card.
# C major, A minor for the opening's problem. Every chord is tuned pure from C (just intonation, see hz()): C, F and G major and A and E
# minor are pure in this table; D minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each note held at one level from its breath to its stop.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/mm_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1952)  # this film's own randomness: the breath, the paper
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


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.006, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a view slid along the glass, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)

# ---- tuning: just intonation from C, so a chord's notes are whole-number ratios of each other and nothing beats. C, F and G major
# and A and E minor are pure in this table; D minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 48, 12)
    return 130.8128 * 2 ** o * _JI[pc]
C3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 = 48, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76

LPIPE, LLOW, FX = 0.05, 0.06, 3.2
LV = [1.0]

def _blow(f0, d, dark):
    """a stopped pipe's note, d seconds long: its odd partials only, a breath's small chiff at its start and a faint breath under it,
    held at one level, its breath stopped over 0.07 s"""
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k, a in ((1, 1.0), (3, 0.24 * dark), (5, 0.09 * dark), (7, 0.035 * dark)):
        if f0 * k > 2200:
            break
        sig += a * np.sin(2 * np.pi * f0 * k * x + 0.4 * k)
    env = np.minimum(1, x / 0.045) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig * env / max(1e-9, float(np.abs(sig).max()))
    br = filt(noise(sec + 0.02)[:n], 'band', (max(120, f0 * 0.9), min(2100, f0 * 4.5))); br = br / max(1e-9, float(np.abs(br).max()))
    sig = sig + br * (0.018 + 0.11 * np.exp(-x / 0.045)) * env
    return norm(filt(filt(sig.astype(np.float32), 'low', 2200), 'high', 70))

def pipe(m, s, g=1.0, dur=1.4, pan=None, until=None):
    """one note of the small pitch pipe: set on its mark, then blown"""
    d = dur if until is None else min(dur, max(0.2, until - s - 0.3))
    put(_until(_blow(hz(m), d, 1.0), s, until), s, g * LV[0] * LPIPE, max(-0.3, min(0.3, (m - 64) * 0.02)) if pan is None else pan)

def low(s, g=1.0, dur=2.2, until=None):
    """the larger pipe, an octave lower: the baseline's low C, darker, in the middle"""
    d = dur if until is None else min(dur, max(0.2, until - s - 0.3))
    put(_until(_blow(hz(C3), d, 0.7), s, until), s, g * LV[0] * LLOW, 0.0)

def chord(notes, s, g=1.0, step=0.16, dur=2.0, until=None):
    """a chord placed from its lowest note up, each note blown in turn and held, all stopped together; low C is the larger pipe's"""
    for i, m in enumerate(notes):
        dd = max(0.5, dur - step * i)
        (low(s + step * i, g, dd, until) if m == C3 else pipe(m, s + step * i, g, dd, None, until))
def figure(notes, s, g=1.0, step=0.3, dur=0.42, last=None, until=None):
    """a short figure, one note at a time, each stopped before the next is blown"""
    for i, m in enumerate(notes):
        pipe(m, s + step * i, g, last if (last and i == len(notes) - 1) else dur, None, until)
MARKS = (E4, G4, C5)                      # the stopper's marks 0, 1 and 2
MARK = tuple(MARKS[k] for k in (0, 1, 2, 1, 2))
def mark(s, g=1.0, shift=0, step=0.3, last=1.8, bass=1.0, until=None):
    """the mark: five notes on the stopper's three marks, the last held over the baseline's low C, blown under the fourth"""
    figure(tuple(m + shift for m in MARK), s, g, step, 0.42, last, until)
    if bass:
        low(s + 3 * step, bass * g, step + last + 0.2, until)

# =============================================================================================================================
# 1. The first minute: the opening. New York, 1952: the low C alone, then C major as the room comes in. Apgar's sheet: one high note,
#    a step down. The deaths: A minor, as the figures come in; the lack of oxygen: A minor again, higher. The newborn left to the most
#    junior doctor: one low A. Each doctor's own word: E for "mild", C for "severe". A baby missed: A minor, low, gone before "Something
#    has to change", which has nothing under it. The score: the mark, whole. Each sign: a soft tap. Ten: C major. The trial and the
#    paper: a sheet each, and G. A low score, seen at once: the low A, then E and high C as everyone sees it. The two averages: E for
#    five, G for eight. Every baby scored: F major. Deaths fell: C major. A data team: one low A at its question; a few measures, the
#    same way every month: the baseline's low C. The title: C major, held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('minute', lid, word, off)
oc = lambda lid, off=0: G('minute', lid, off)
END = E('minute')
low(0.6, 0.8, 3.0)
card(ow('when', 'York', -0.4), 0.004, px(960))
chord((G3, C4, E4), ow('when', 'York', 0.1), 0.6, step=0.22, dur=3.0)
card(ow('apgar', 'Virginia', -0.3), 0.004, px(1210))
figure((G4, E4), ow('apgar', 'Virginia', 0.0), 0.5, 0.5, 0.45, 1.4)
card(ow('deaths', 'America', -0.2), 0.004, px(550))
chord((A3, C4, E4), ow('deaths', 'fifty', -0.1), 0.55, step=0.2, dur=2.6)
card(ow('deaths', 'day', -0.4), 0.0035, px(1360))
card(ow('air', 'half', -0.4), 0.004, px(960))
chord((C4, E4, A4), ow('air', 'oxygen', -0.1), 0.5, step=0.2, dur=2.4)
pipe(A3, ow('mother', 'junior', 0.0), 0.5, 1.6)
tap(ow('words', 'mild', -0.2), 0.0035, px(1640))
pipe(E4, ow('words', 'mild', 0.0), 0.45, 0.9)
tap(ow('words', 'severe', -0.2), 0.0035, px(700))
pipe(C4, ow('words', 'severe', 0.0), 0.45, 0.9)
chord((A3, E4), ow('harm', 'trouble', -0.2), 0.5, step=0.3, dur=4.0, until=oc('change', -0.3))
card(ow('score', 'score', -0.3), 0.004, px(700))
mark(ow('score', 'score', 0.1), 0.6, 0, 0.3, 1.8, 0.9)
card(ow('signs', 'minute', -0.3), 0.004, px(860))
for word, off in (('heartbeat', -0.3), ('breathing', -0.3), ('firmly', -0.4), ('reacts', -0.4), ('colour', -0.3)):
    tap(ow('signs', word, off), 0.003, px(860))
chord((C4, E4, G4, C5), ow('points', 'Ten', -0.2), 0.5, step=0.14, dur=2.2)
card(ow('trial', 'tries', -0.2), 0.004, px(540))
card(ow('trial', 'publishes', -0.3), 0.004, px(1330))
pipe(G4, ow('trial', 'publishes', 0.0), 0.45, 1.4)
tap(ow('seen', 'low', -0.3), 0.004, px(1500))
pipe(A3, ow('seen', 'low', 0.0), 0.5, 1.2)
figure((E4, C5), ow('seen', 'everyone', -0.1), 0.45, 0.4, 0.45, 1.2)
card(ow('compare', 'compare', -0.4), 0.004, px(960))
pipe(E4, ow('spinal', 'five', -0.3), 0.45, 1.0)
pipe(G4, ow('spinal', 'spinal', -0.1), 0.45, 1.6)
card(ow('spread', 'sixties', -0.4), 0.004, px(960))
chord((F3, C4, A4), ow('spread', 'today', -0.1), 0.5, step=0.18, dur=2.2)
card(oc('fell', 0.1), 0.004, px(960))
slide(ow('fell', 'twenty', -0.3), 0.7, 0.003, px(800))
slide(ow('fell', 'sixteen', -0.6), 0.7, 0.003, px(1120))
chord((G3, C4, E4, G4), ow('fell', 'sixteen', -0.2), 0.45, step=0.16, dur=2.0)
card(ow('data', 'team', -0.3), 0.004, px(960))
pipe(A3, ow('data', 'need', -0.4), 0.45, 1.3)
card(ow('few', 'few', -0.2), 0.004, px(960))
low(ow('few', 'same', 0.0), 0.7, 2.0)
chord((C3, G3, E4, C5), oc('breath', 0.3), 0.65, step=0.22, dur=4.4, until=END)

# 2. Busy isn't better: the chapter turns on F major; the strategy's sheet; what keeps a team busy, and its bars rising, one slide; the
#    people still waiting: the low A; Helena's two sheets; the question's last word: G; the governance films, two taps
LV[0] = 0.9
bw = lambda lid, word, off=0: W('busy', lid, word, off)
bc = lambda lid, off=0: G('busy', lid, off)
chord((F3, A3, C4, F4), S0('busy') + 0.3, 0.5, step=0.16, dur=2.2)
card(bc('july', 0.3), 0.004, px(1140))
card(bw('easy', 'requests', -0.5), 0.004, px(1180))
slide(bc('rise', 0.0), 2.4, 0.003, px(1180))
pipe(A3, bw('rise', 'people', -0.3), 0.5, 1.6)
card(bw('get', 'Helena', -0.1), 0.004, px(1140))
card(bw('ask', 'question', -0.4), 0.004, px(1140))
pipe(G4, bw('ask', 'decides', 0.0), 0.45, 1.6)
tap(bw('gov', 'governance', -0.3), 0.003, px(1140))
tap(bw('gov', 'Teachers', -0.3), 0.003, px(1140))

# 3. Three groups, few measures: the balanced scorecard's sheet, and C major from its middle; the page slides on; a soft tap for each
#    measure as it comes in; the two questions' sheet; eight on one page: G major; the counts kept off the page: one tap
LV[0] = 0.9
gw = lambda lid, word, off=0: W('groups', lid, word, off)
gc = lambda lid, off=0: G('groups', lid, off)
card(S0('groups') + 0.9, 0.004, px(960))
chord((E3, G3, C4, E4), gw('card', 'balanced', -0.1), 0.5, step=0.18, dur=2.2)
slide(gc('three', -0.1), 0.9, 0.003, px(716))
for lid, word, off, x in (('delivery', 'days', -0.2, 260), ('delivery', 'sent', -0.2, 560), ('delivery', 'open', -0.2, 860), ('mgmt', 'promise', -0.3, 1160),
                          ('value', 'benefits', -0.3, 260), ('value', 'decisions', -0.3, 560), ('value', 'people', -0.3, 860), ('two', 'two', -0.2, 1160)):
    tap(gw(lid, word, off), 0.003, px(x))
card(gw('two', 'two', -0.1), 0.004, px(1640))
chord((G3, B3, D4, G4), gw('eight', 'Eight', 0.0), 0.5, step=0.16, dur=2.0)
tap(gc('rest', 0.1), 0.003, px(1500))

# 4. A baseline and a decision: the four things' sheet; the measure's sheet; its baseline, 41: the larger pipe's low C, alone; the
#    glossary slides on, a tap for each of its rows; sent back, one piece in eight: A and C; the work sent out and sent back, two slides;
#    the page a governed product, owned: C major from E
LV[0] = 0.9
cw = lambda lid, word, off=0: W('baseline', lid, word, off)
cc = lambda lid, off=0: G('baseline', lid, off)
card(S0('baseline') + 0.9, 0.004, px(960))
card(cc('base', -0.1), 0.004, px(550))
card(cw('base', 'February', -0.2), 0.004, px(1400))
low(cw('base', 'forty-one', 0.0), 0.8, 2.6)
slide(cw('def', 'definition', -0.3), 0.9, 0.003, px(1440))
for t0 in (cw('defn', 'working', -0.4), cc('reader', -0.6), cc('reader', -0.2)):
    tap(t0, 0.003, px(1440))
card(cw('pair', 'quality', -0.3), 0.004, px(1440))
chord((A3, C4), cw('pair', 'eight', -0.2), 0.45, step=0.3, dur=1.8)
slide(cw('why', 'rework', -0.4), 1.3, 0.003, px(1440))
slide(cw('why', 'rework', 0.9), 1.3, 0.003, px(1440))
slide(cc('product', -0.1), 0.9, 0.003, px(716))
tap(cw('product', 'governed', -0.4), 0.003, px(1640))
chord((E4, G4, C5), cw('product', 'owns', -0.2), 0.45, step=0.18, dur=2.0)

# 5. The trend, not one number: the chart slides on; June, 24, read against the baseline: the low C, and G over it; the page slides
#    on; promises met climbing to 82: C, E and G, one at a time as the line reaches them; beside it, nine open against six: A minor, low;
#    finish, then start; six again: a tick, and C major; the decision informed: a tick, and F major; the benefit, owned: a tick, and G
LV[0] = 0.9
tw = lambda lid, word, off=0: W('trend', lid, word, off)
tc = lambda lid, off=0: G('trend', lid, off)
slide(S0('trend') + 0.6, 0.9, 0.003, px(716))
low(S0('trend') + 3.1, 0.75, 2.2)
pipe(G4, S0('trend') + 3.4, 0.45, 1.8)
slide(tc('line', -0.2), 0.9, 0.003, px(716))
slide(tc('aug', -0.3), 0.9, 0.003, px(716))
for k, m in enumerate((C4, E4, G4)):
    pipe(m, tc('aug', 0.5 + 0.9 * k), 0.42, 0.8 if k < 2 else 1.6)
tap(tw('load', 'Beside', -0.5), 0.003, px(1030))
chord((A3, E4), tw('load', 'nine', -0.1), 0.45, step=0.3, dur=2.0)
tap(tw('fix', 'finished', -0.2), 0.003, px(1640))
ticked(tw('fix', 'six', -0.1), 0.004, px(1640))
chord((C4, G4, E5), tw('fix', 'six', 0.1), 0.45, step=0.18, dur=1.8)
slide(tc('decision', -0.3), 0.9, 0.003, px(716))
ticked(tw('decision', 'deferred', -0.2), 0.004, px(1640))
chord((F3, A3, F4), tw('decision', 'deferred', 0.0), 0.45, step=0.18, dur=1.8)
card(tw('benefit', 'benefit', -0.5), 0.0035, px(1030))
ticked(tw('owner', 'director', -0.2), 0.004, px(1640))
pipe(G4, tw('owner', 'director', 0.1), 0.45, 1.8)

# 6. For the team, never a target: Goodhart's law: A minor, as the measure becomes a target; in the delivery room, someone else takes
#    the score: C major, high; counted the same way; first use confirmed: a tick; every measure the team's: F major, as no one is a target
LV[0] = 0.9
ew = lambda lid, word, off=0: W('team', lid, word, off)
ec = lambda lid, off=0: G('team', lid, off)
card(S0('team') + 0.9, 0.004, px(960))
chord((E3, A3, C4, E4), ew('law', 'target', -0.2), 0.45, step=0.18, dur=2.2)
chord((G4, C5, E5), ew('apgar', 'someone', 0.0), 0.45, step=0.18, dur=2.0)
card(ew('counted', 'counted', -0.4), 0.004, px(960))
ticked(ew('confirm', 'confirmed', -0.4), 0.004, px(960))
card(ew('theirs', "team's", -0.4), 0.004, px(960))
chord((F3, C4, F4, A4), ew('theirs', 'target', -0.1), 0.45, step=0.18, dur=2.0)
tap(ew('ldp', 'leading', -0.4), 0.003, px(960))

# 7. On Monday: New York again: the sheet, and the mark, whole, as every baby is seen; December: C major from the low C; a tick for
#    each thing people got, and G major as the warehouse is retired; each piece of advice pinned up; the close: the mark an octave lower,
#    its last note held over the low C into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(mw('back', 'five', -0.3), 0.004, px(700))
mark(mw('back', 'seen', -0.3), 0.5, 0, 0.3, 1.8, 0.8)
chord((C3, E4, G4), mw('dec', 'December', 0.0), 0.45, step=0.2, dur=2.0)
for lid, word, off in (('dec', 'fourteen', -0.2), ('dec', 'half', -0.2), ('more', 'eighty-six', -0.3), ('more', 'nine', -0.3), ('retire', 'seventeenth', -0.3)):
    ticked(mw(lid, word, off), 0.0035, px(1640))
chord((B3, D4, G4), mw('retire', 'seventeenth', 0.1), 0.42, step=0.18, dur=1.8)
for t0, x in ((mc('list', 0.3), 390), (mw('few', 'few', -0.3), 960), (mw('base', 'baseline', -0.4), 1530), (mw('pair', 'quality', -0.4), 610), (mw('theirs', 'team', -0.4), 1310)):
    card(t0, 0.0035, px(x))
e0 = mc('breath', 0.6)
mark(e0 + 0.4, 0.5, -12, 0.34, 5.0, 0.9, until=TOT)
