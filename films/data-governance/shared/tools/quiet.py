"""The film's sound, checked: python tools/quiet.py, from a film's source folder, after tools/build.py (it plays the score on its own,
so it needs no voice; run it again after every change to tools/score.py, before tools/audio.py mixes it). Every governance film runs it
(its tools/quiet.py, through this folder's run.py), and so does every film of What an agent is (through its module's run.py, with that
module's lang.py).

The films' sound (the author's rule for film music, 20 October 2026; and the author's review of What an agent is, 4 November 2026,
which heard glitches in Decades in the making and found A model, reasoning, hands and a loop "a bit disruptive and repetitive", and
asked for the same fixes in every governance and agent film):
music plays under the opening story from outside data; after that, music and sounds come in from time to time, at a chapter's turn,
under a moment on screen or in a pause without words, never as a constant bed under the voice; nothing in it trembles or pulses, except
an urgent pulse in a chapter where the story turns to an error or a rush, which the film lists in film.json's "urgent"; a figure isn't
played again and again; and the music and the effects sit no louder than in five governance films whose sound the author accepted
(the prologue, Who decides, Rules that run, An agent that checks and Teachers of data, measured this way on 4 November 2026, before
the day's fixes to their own sound).
This plays the film's score (tools/score.py) on its own and checks:
  - when: after the opening, no chapter has music for more than half its length, or for more than 12 seconds without a break, and the
    music sounds for at most 40% of the time after the opening (the five: 26 to 34%);
  - how often: after the opening, the music comes in (after a second or more without it) on average at most once every 10 seconds,
    and at most 5 times in any 30 seconds (the five: once every 10.1 to 21.6 s, and at most 3 to 6 times in 30 s);
  - no repeats: a figure (notes that follow each other within 0.8 s) of two notes or more isn't played again within 20 seconds after
    the opening, nor more than 4 times; in the opening, where chords come back as the story moves, not again within 4 seconds, as the
    three gusts of one opening did, 1.7 s apart (a figure is its notes, found from each note's sound; the same notes in the same order
    are the same figure). Three of the five played a figure again soon (Who decides once, Rules that run twice and An agent that
    checks seven times), and two played one 5 and 9 times (in An agent that checks, a check's two notes); since the author found
    A model, reasoning, hands and a loop repetitive, every film keeps them rarer, these five too;
  - how loud: the music's loud moments (the 90th percentile of its level over 0.4 s while it sounds) at most -26.5 dB of full scale,
    its loudest notes (the 99th percentile over 0.05 s) at most -23 dB, and the effects' loud moments (the 90th percentile over 0.05 s
    while they sound) at most -43 dB, all as one speaker plays the score before tools/audio.py mixes it (the five:
    -27.0 to -30.9 dB, -23.5 to -25.9 dB and -44.2 to -46.7 dB; their voice's median level is about -17.6 dB, so the music's loud
    moments sit 9 to 13 dB under it before the mix ducks the music under the voice, and 18 to 22 dB under while it speaks);
  - one at a time: no more than 12 effects (the sounds on the effects bus; those that begin within 25 ms of each other are heard as
    one, and count once) begin in any one second (the five: 7 to 12, and 18 where nine people clapped in Teachers of data, now one
    soft texture). Many tiny grains in a burst, such as 120 paper flicks in two seconds or 126 coin clinks in one, sound
    like crackle or a buzz: play a few sounds, or one soft texture that swells in;
  - no beats: no two held sounds are a little out of tune with each other, so that they beat, 0.3 to 12 times a second, when a phone's
    one speaker adds the two channels together, loud enough to move the music's level by a fifth or more;
  - no pulse: nothing pulses (urgent(), pulse() or ostinato()) outside the chapters film.json lists in "urgent".
The opening is the chapters film.json lists in "story" (by default, the first). Music is what the score puts on the music bus (put()),
not the effects (X()), and it counts while it's within 24 dB of the music's loudest three seconds. A break is a second or more without.
Each failure names the lines of tools/score.py that placed the sounds. The master data films keep a copy of the first checks each.
python tools/quiet.py --all prints every beat, repeat and busy second it finds, not only the first few."""
import collections, json, pathlib, sys, traceback
import numpy as np
if 'run' not in sys.modules:  # run on its own: this folder's tools first, then From words to data's; a film's run.py has set its own
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    import run
from lang import *
import music
from playwright.sync_api import sync_playwright

SHARE, RUN, GAP, FLOOR = 0.5, 12.0, 1.0, 24.0       # a chapter's music, a run of it, a break, and what counts as sounding
TOTAL_SHARE = 0.40                                  # the music's share of the time after the opening
EVERY, WIN, IN_WIN = 10.0, 30.0, 5                  # the music comes in on average at most once every EVERY s, IN_WIN times in WIN s
JOIN = 0.8                                          # notes that follow each other within JOIN s are one figure
AGAIN, AGAIN0, TIMES = 20.0, 4.0, 4                # a figure isn't heard again within AGAIN s (AGAIN0 in the opening), nor
                                                    # more than TIMES times after the opening
LOUD, PEAK, FXLOUD = -26.5, -23.0, -43.0            # dB of full scale, as one speaker plays the score
FXRATE, ONE = 12, 0.025                             # effects that may begin in one second; those within ONE s of each other are one
ALL = '--all' in sys.argv

# the film's timeline, from its render page, as tools/audio.py reads it
with sync_playwright() as p:
    b, pg = render_page(p)
    info = pg.evaluate("filmInfo()")
    b.close()
SR = music.SR; TOT = info['total']; n = int(TOT * SR) + SR
music.init(n)
ST = {s['id']: s for s in info['scenes']}; music.ST.update(ST)
STORY = META.get('story') or [info['scenes'][0]['id']]
SCORE = str(ROOT / 'tools' / 'score.py')
mmss = lambda t: '%d:%04.1f' % (max(0, t) // 60, max(0, t) % 60)


def chapter(t):
    for s in info['scenes'][::-1]:
        if t >= s['start'] - 1e-6:
            return s['id']
    return info['scenes'][0]['id']


def in_story(t):
    return chapter(t) in STORY


def where():
    """the lines of tools/score.py that placed a sound, outermost first"""
    return [f.lineno for f in traceback.extract_stack() if f.filename == SCORE]


def pitch(sig):
    """the note a sound plays, as a MIDI number: the pitch whose harmonics carry most of its spectrum, past the attack, among those
    whose own partial is strong; None for a sound with no clear pitch"""
    a = np.asarray(sig[int(0.03 * SR):int(0.6 * SR)], np.float64)
    if len(a) < 2048 or not np.any(a):
        return None
    w = np.hanning(len(a)); nf = 1 << 16
    sp = np.abs(np.fft.rfft(a * w, nf)); fr = np.fft.rfftfreq(nf, 1 / SR); top = sp.max()
    at = lambda f: sp[max(0, np.searchsorted(fr, f) - 2):np.searchsorted(fr, f) + 3].max()
    best, bm = 0.0, None
    for m in np.arange(28, 96, 0.25):
        f = 440 * 2 ** ((m - 69) / 12)
        if at(f) < 0.12 * top:
            continue
        s = sum(at(f * h) / h ** 0.5 for h in range(1, 7) if f * h < 4000)
        if s > best:
            best, bm = s, m
    return int(round(bm)) if bm is not None else None


# every sound the score places: on the music bus, its time, note and the lines that placed it; on the effects bus, its time and lines
NOTES, FXS, HELD, PULSES = [], [], [], []
_put0 = music._put


def _put(L, R, sig, start, g, pan):
    sig = np.asarray(sig, np.float32)
    if len(sig) and g and np.any(sig):
        if L is music.XL:
            FXS.append((start, where()))
        else:
            NOTES.append((start, pitch(sig), where()))
    return _put0(L, R, sig, start, g, pan)


music._put = _put


def partials(sig):
    """the strongest partials of a held sound, past its attack: where its spectrum peaks, within 30 dB of the strongest"""
    a = sig[int(0.4 * SR):int(8.4 * SR)]
    if len(a) < SR:
        a = sig[:int(8 * SR)]
    w = np.hanning(len(a)).astype(np.float32)
    nf = 1 << int(np.ceil(np.log2(len(a) * 4)))
    sp = np.abs(np.fft.rfft(a * w, nf)) * 2 / w.sum(); fr = np.fft.rfftfreq(nf, 1 / SR)
    lo, hi = np.searchsorted(fr, 30), np.searchsorted(fr, 2600)
    s, f = sp[lo:hi], fr[lo:hi]
    if not len(s) or s.max() <= 0:
        return []
    i = np.nonzero((s[1:-1] > s[:-2]) & (s[1:-1] >= s[2:]) & (s[1:-1] > s.max() * 10 ** (-30 / 20)))[0] + 1
    i = i[np.argsort(-s[i])][:24]
    return [(float(f[k]), float(s[k])) for k in i]


def plain(pk):
    """the partials without a vibrato's sidebands: a weaker peak beside a stronger one, mirrored on the stronger one's other side, is
    a note's own vibrato (a clarinet's, a cello's), not a second note"""
    return [(f, a) for f, a in pk
            if not any(b > a and 0.3 <= abs(f - c) <= 12 and any(abs(h - (2 * c - f)) < 0.4 for h, _ in pk) for c, b in pk)]


_put1 = music.put


def put(sig, start, g=1.0, pan=0.0):
    sig = np.asarray(sig, np.float32)
    if len(sig) >= 2 * SR and g > 0:
        p = max(-1.0, min(1.0, pan)); mono = g * (np.sqrt(0.5 * (1 - p)) + np.sqrt(0.5 * (1 + p)))
        HELD.append((start, len(sig) / SR, [(f, a * mono) for f, a in plain(partials(sig))]))
    _put1(sig, start, g, pan)


music.put = put
for name in ('urgent', 'pulse', 'ostinato'):
    def played(*a, _f=getattr(music, name), _n=name, **k):
        PULSES.append((_n, a[0] if a else 0.0)); return _f(*a, **k)
    setattr(music, name, played)

# the score, as tools/audio.py plays it
ns = {k: v for k, v in vars(music).items() if not k.startswith('_')}
ns.update(ST=ST, TOT=TOT, G=lambda sid, cid, off=0: ST[sid]['start'] + ST[sid]['cues'][cid] + off,
          S0=lambda sid: ST[sid]['start'], E=lambda sid: ST[sid]['start'] + ST[sid]['dur'], cq=lambda sid, cid: ST[sid]['cues'][cid])
exec(compile((ROOT / 'tools' / 'score.py').read_text(), SCORE, 'exec'), ns)
fails = []
lines = lambda ls: 'tools/score.py line%s %s' % ('s' if len(ls) > 1 else '', ', '.join(str(x) for x in sorted(ls)))

# when the music sounds, as one speaker plays it: its level every 10 ms, against its loudest three seconds
m = (music.ML + music.MR).astype(np.float64); fr = len(m) // (SR // 100)
e = np.sqrt((m[:fr * (SR // 100)].reshape(fr, -1) ** 2).mean(1)); e = np.convolve(e, np.ones(5) / 5, 'same')
ref = np.sqrt(np.convolve(e ** 2, np.ones(300) / 300, 'valid').max()) if fr > 300 else e.max()
on = e > ref * 10 ** (-FLOOR / 20)
story = np.zeros(fr, bool)
for sid in STORY:
    s = ST[sid]; story[int(s['start'] * 100):int((s['start'] + s['dur']) * 100)] = True


def runs(x):
    """the stretches of x, joined across breaks shorter than GAP: [(first frame, frame after the last)]"""
    d = np.diff(np.concatenate([[0], x.astype(np.int8), [0]])); a, b = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]
    out = []
    for s, t in zip(a, b):
        if out and s - out[-1][1] < GAP * 100:
            out[-1][1] = t
        else:
            out.append([s, t])
    return out


R = runs(on & ~story)
print('%-12s %7s %7s %9s' % ('chapter', 'length', 'music', 'longest'))
for s in info['scenes']:
    a, b = int(s['start'] * 100), int((s['start'] + s['dur']) * 100)
    share = on[a:b].mean() if b > a else 0.0
    if s['id'] in STORY:
        print('%-12s %6.1fs %6.0f%% %9s  the opening: music may play throughout' % (s['id'], s['dur'], share * 100, ''))
        continue
    full = max([(t - r) / 100 for r, t in R if t > a and r < b] + [0])
    bad = []
    if share > SHARE:
        bad.append('music for %.0f%% of it' % (share * 100))
    if full > RUN:
        bad.append('%.1f s of music without a break' % full)
    print('%-12s %6.1fs %6.0f%% %8.1fs  %s' % (s['id'], s['dur'], share * 100, full, '; '.join(bad) or 'ok'))
    fails += ['%s: %s' % (s['id'], x) for x in bad]
after = ~story[:len(on)]
total_share = on[after].mean() if after.any() else 0.0
print('\nafter the opening, the music sounds %.0f%% of the time (at most %.0f%%)' % (total_share * 100, TOTAL_SHARE * 100))
if total_share > TOTAL_SHARE:
    fails.append('after the opening, the music sounds %.0f%% of the time, more than %.0f%%: let more moments go without it'
                 % (total_share * 100, TOTAL_SHARE * 100))

# how often the music comes in after the opening: each stretch of it (R, joined across breaks under a second) is one entry, except one
# that only carries on from the opening's music, ringing past its end
rest = TOT - sum(ST[sid]['dur'] for sid in STORY if sid in ST)
starts = [r / 100 for r, t in R if r == 0 or not on[r - 1]]
every = rest / max(1, len(starts)); busiest, bt, j = 0, 0.0, 0
for i, t in enumerate(starts):
    while starts[j] < t - WIN + 1e-9:
        j += 1
    if i - j + 1 > busiest:
        busiest, bt = i - j + 1, starts[j]
print('after the opening, the music comes in %d times, once every %.1f s (at least %.0f s); at most %d times in any %.0f s (at most %d), '
      'from %s' % (len(starts), every, EVERY, busiest, WIN, IN_WIN, mmss(bt)))
if every < EVERY:
    fails.append('after the opening, the music comes in once every %.1f s on average, more often than once every %.0f s: play each figure '
                 'where it first appears and where the story turns, and let the other moments go without music' % (every, EVERY))
if busiest > IN_WIN:
    ls = {x for t, mi, ls_ in NOTES if bt <= t < bt + WIN for x in ls_[:1]}
    fails.append('the music comes in %d times in the %.0f s from %s (%s), more than %d: let some of these moments go without music'
                 % (busiest, WIN, mmss(bt), lines(ls), IN_WIN))

# figures: notes that follow each other within JOIN seconds
figs = []
for t, mi, ls in sorted(NOTES, key=lambda x: x[0]):
    if figs and t - figs[-1][-1][0] <= JOIN:
        figs[-1].append((t, mi, ls))
    else:
        figs.append([(t, mi, ls)])
NAMES = 'C C# D Eb E F F# G Ab A Bb B'.split()
nm = lambda k: ' '.join((NAMES[x % 12] + str(x // 12 - 1)) if x is not None else '?' for x in k)
seen, count, again = collections.defaultdict(list), collections.Counter(), []
for f in figs:
    k = tuple(x[1] for x in f); t = f[0][0]
    if len(k) < 2 or None in k:
        continue
    near = [u for u, _ in seen[k] if t - u < (AGAIN0 if in_story(t) else AGAIN)]
    if near:
        again.append((t, near[-1], k, {x[2][0] for x in f if x[2]} | {x for u, ls in seen[k] if u == near[-1] for x in ls}))
    seen[k].append((t, {x[2][0] for x in f if x[2]}))
    if not in_story(t):
        count[k] += 1
for t, u, k, ls in (again if ALL else again[:6]):
    print('  %s  %s again, %.1f s after %s (%s)' % (mmss(t), nm(k), t - u, mmss(u), lines(ls)))
if again:
    fails.append('%d figures played again soon after themselves (within %.0f s, or %.0f s in the opening), which sounds repetitive: play '
                 'each once there, or let the second go without music' % (len(again), AGAIN, AGAIN0))
often = [(k, c) for k, c in count.items() if c > TIMES]
for k, c in often:
    fails.append('the figure %s is played %d times after the opening, more than %d: keep it for where the story turns (%s)'
                 % (nm(k), c, TIMES, lines({u for t, ls in seen[k] for u in ls})))

# how loud, as one speaker plays the score: the music's level over 0.4 s and over 0.05 s while it sounds, and the effects' over 0.05 s
h = SR // 200
def level(x, win):
    f = len(x) // h; p = (x[:f * h].reshape(f, -1) ** 2).mean(1); w = max(1, int(win * 200))
    return np.sqrt(np.convolve(p, np.ones(w) / w, 'same'))
db = lambda x: 20 * np.log10(max(float(x), 1e-12))
m4, m05 = level(m, 0.4), level(m, 0.05)
s5 = on[np.minimum(np.arange(len(m4)) // 2, len(on) - 1)]
xm = (music.XL + music.XR).astype(np.float64); x05 = level(xm, 0.05); xs = x05 > 10 ** (-70 / 20)
loud = db(np.percentile(m4[s5], 90)) if s5.any() else -120
peak = db(np.percentile(m05[s5], 99)) if s5.any() else -120
fxl = db(np.percentile(x05[xs], 90)) if xs.any() else -120
print('the music\'s loud moments %.1f dB (at most %.1f), its loudest notes %.1f dB (at most %.1f); the effects\' loud moments %.1f dB '
      '(at most %.1f)' % (loud, LOUD, peak, PEAK, fxl, FXLOUD))
if loud > LOUD:
    fails.append('the music\'s loud moments sit at %.1f dB, %.1f dB over the limit (at most %.1f, from the governance films the author '
                 'accepted): lower its levels'
                 % (loud, loud - LOUD, LOUD))
if peak > PEAK:
    fails.append('the music\'s loudest notes reach %.1f dB, more than %.1f: lower the plucked or struck notes that stand out'
                 % (peak, PEAK))
if fxl > FXLOUD:
    fails.append('the effects\' loud moments sit at %.1f dB, %.1f dB over the limit (at most %.1f, from the governance films the author '
                 'accepted): lower them'
                 % (fxl, fxl - FXLOUD, FXLOUD))

# effects, one at a time: how many begin in each second. Sounds that begin within ONE seconds of each other are heard as one (a knock
# and the tap on it, or the slices of a sound that crosses the stereo field), so they count once
ft = []
for t, ls in sorted(FXS, key=lambda x: x[0]):
    if ft and t - ft[-1][0] < ONE:
        ft[-1][1].extend(ls)
    else:
        ft.append((t, list(ls)))
busy, j = [], 0
for i, (t, ls) in enumerate(ft):
    while ft[j][0] < t - 1.0 + 1e-9:
        j += 1
    if i - j + 1 > FXRATE and (not busy or ft[j][0] >= busy[-1][0] + 1.0):
        k = i
        while k + 1 < len(ft) and ft[k + 1][0] < ft[j][0] + 1.0:
            k += 1
        busy.append((ft[j][0], k - j + 1, {x[1][0] for x in ft[j:k + 1] if x[1]}))
most = max([0] + [sum(1 for u, _ in ft if t <= u < t + 1.0) for t, _ in ft])
print('effects: %d, at most %d beginning in one second (at most %d)' % (len(ft), most, FXRATE))
for t, c, ls in (busy if ALL else busy[:6]):
    print('  %s  %d effects in one second (%s)' % (mmss(t), c, lines(ls)))
if busy:
    fails.append('%d moments with more than %d effects in one second, which sound like crackle or a buzz: play a few sounds, or one soft '
                 'texture that swells in' % (len(busy), FXRATE))

# beats: two held partials a little apart, sounding together for a second and a half or more, the weaker within 10 dB of the stronger
# and within 20 dB of the music's loudest three seconds, so the beat moves the music's level by a fifth or more
H = sorted(HELD, key=lambda h: h[0]); quiet = ref * np.sqrt(2) * 10 ** (-20 / 20); beats = []
for i, (s1, d1, p1) in enumerate(H):
    for j in range(i, len(H)):
        s2, d2, p2 = H[j]
        if s2 > s1 + d1 - 1.5:
            break
        if min(s1 + d1, s2 + d2) - max(s1, s2) < 1.5:
            continue
        for x, (fa, aa) in enumerate(p1):
            for y, (fb, ab) in enumerate(p2):
                if j == i and y <= x:
                    continue
                df = abs(fa - fb)
                if 0.3 <= df <= 12 and max(fa, fb) <= 1.03 * min(fa, fb) and min(aa, ab) >= quiet and min(aa, ab) >= 0.32 * max(aa, ab):
                    beats.append((max(s1, s2), df, min(fa, fb), max(fa, fb)))
if beats:
    beats.sort(); seen_ = sorted({round(b[0]) for b in beats})
    print('\n%d pairs of held notes beat, from %s to %s (%d places), on a phone\'s one speaker:' % (len(beats), mmss(beats[0][0]), mmss(beats[-1][0]), len(seen_)))
    for t, df, fa, fb in (beats if ALL else beats[:6]):
        print('  %s  %.1f Hz and %.1f Hz beat %.1f times a second' % (mmss(t), fa, fb, df))
    fails.append('%d pairs of held notes a little out of tune with each other, so they beat: one note on two voices a little apart (give it one), '
                 'or, in a timbre rich in overtones, a tempered fifth whose overtones meet (tune the fifth pure, or soften its overtones)' % len(beats))
URGENT = META.get('urgent') or []
for name, t in PULSES:
    w = chapter(t) if t < TOT else None
    if w not in URGENT:
        fails.append('%s() at %s (%s): nothing pulses, except in a chapter where the story turns to an error or a rush, listed in '
                     'film.json\'s "urgent"' % (name, mmss(t), w or 'after the end'))

print()
if fails:
    raise SystemExit('The sound doesn\'t follow the films\' rules (the author\'s, 20 October and 4 November 2026):\n  ' + '\n  '.join(fails))
print('The sound follows the films\' rules: the opening (%s) has its music, the rest comes in from time to time and isn\'t repeated, it '
      'sits no louder than the governance films the author accepted, the effects come one at a time, nothing beats, and nothing '
      'pulses%s.'
      % (', '.join(STORY), ' outside ' + ', '.join(URGENT) if URGENT else ''))
