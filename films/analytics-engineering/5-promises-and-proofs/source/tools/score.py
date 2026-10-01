# Promises and proofs: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). This film's palette, from the series plan: F major; the series' mark, 1-4-5-8, on a French horn,
# soft and low; a bed of low brass chorale chords that change with the chapters. For London from 1300: the scraper's filtered
# scrape (the assay) and the punch's low thud (the mark). For the present: a test passing is a low felt note, a test failing
# a muted double knock, and a contract clause locking a soft wooden latch.
# Two rules, as in the opening film:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: sustained chords that change with the chapters.
#  - Every sound is an event on screen, at the moment it appears. Each effect uses the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed. Change one, change both.
# Everything stays low and soft, filtered below about 2.5 kHz. No chimes, pings or shimmers.

import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's kt_w() estimates it"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def _h(i, k=0):
    """a fixed pseudo-random number in 0..1, so the small variations are the same on every mix"""
    return ((i * 9301 + k * 49297 + 233280) % 233280) / 233280.0

# ---- instruments ----
def horn(m, start, g=0.05, pan=0.0, sec=2.6):
    """a French horn, soft and low: a round brass tone with a slow swell in, a little vibrato late, filtered dark"""
    f = mf(m); x = tt(sec); vib = 0.003 * f * 2 * np.pi * np.minimum(1, x / 1.2)
    ph = 2 * np.pi * f * x + vib * np.sin(2 * np.pi * 4.8 * x) / 4.8
    s = sum(np.sin(k * ph) * w for k, w in ((1, 1.0), (2, 0.55), (3, 0.3), (4, 0.16), (5, 0.08), (6, 0.04)))
    s = s * env(sec, min(0.18, sec / 4), min(1.0, sec / 2.5))
    put(norm(filt(s.astype(np.float32), 'low', 1300)), start, g, pan)
def chorale(ch, start, sec, g=0.03):
    """a low brass chorale: each note a soft, slow brass voice, the chord held, filtered dark"""
    x = tt(sec); e = env(sec, 2.2, 3.0); s = np.zeros_like(x)
    for j, m in enumerate(ch):
        f = mf(m) * (1 + 0.0015 * (j - 1.5)); ph = 2 * np.pi * f * x
        s += sum(np.sin(k * ph + j) * w for k, w in ((1, 1.0), (2, 0.42), (3, 0.2), (4, 0.09)))
    s = filt((s * e / len(ch)).astype(np.float32), 'low', 1000)
    put(s, start, g, -0.35); put(s, start + 0.03, g * 0.8, 0.35)
def bed(sid, chords, a=None, b=None, g=0.04):
    """the chapter's chords, one after another, each starting 2 s early and lasting 4 s longer, over a low F"""
    s0, s1 = span(sid, a, b); d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        chorale(ch, s0 + i * d - 2.0, d + 4.0, g)
        drone(ch[0] - 12, s0 + i * d - 2.0, d + 4.0, 0.016, 'sine')
def mark(start, root, g=0.07):
    """the series' four notes, 1-4-5-8, rising, on the horn"""
    for i, iv in enumerate([0, 5, 7, 12]):
        horn(root + iv, start + i * 0.38, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.4 if i == 3 else 2.2)

# ---- soft sounds, all low-passed ----
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note: a test passing, a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def fail(s, g=0.05, pan=0.0):
    """a test failing: a muted double knock, low"""
    for k in range(2):
        x = tt(0.2); X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 30)).astype(np.float32), 'low', 900)), s + k * 0.16, g * (1 if k == 0 else 0.8), pan)
def latch(s, g=0.05, pan=0.0):
    """a contract clause locking: a soft wooden latch, a small click of wood and then the catch, both low"""
    knock(s, g * 0.6, pan)
    x = tt(0.14); X(norm(filt((np.sin(2 * np.pi * 330 * x) * np.exp(-x * 55) + 0.3 * filt(noise(0.14), 'band', (300, 1400)) * np.exp(-x * 80)).astype(np.float32), 'low', 1600)), s + 0.07, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def scrape(s, g=0.03, pan=0.2, sec=0.5):
    """the scraper taking a sliver from the foot: a dry, filtered scrape that rises and falls"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2200)) * np.sin(np.pi * x / sec) ** 1.5 * (0.75 + 0.25 * np.sin(2 * np.pi * 14 * x)), s, g, pan)
def press(s, g=0.1):
    """a stamp or a punch: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def lines(t0, n, per, g=0.02, pan=-0.3):
    """one muffled key per line, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g * (0.85 + 0.3 * _h(k, n)), pan + 0.1 * (_h(k, 3) - 0.5))

# chords (MIDI note numbers): F major and its neighbours, low
F = [41, 48, 53, 57, 60]; FM7 = [41, 48, 52, 57]; BB = [46, 53, 58, 62]; BBM7 = [46, 53, 57, 62]; C = [48, 55, 60, 64]
CSUS = [48, 53, 55, 60]; DM7 = [38, 50, 53, 57, 60]; GM7 = [43, 50, 53, 58]; AM7 = [45, 52, 55, 60]; FSUS = [41, 48, 53, 55, 58]

# 1. Tested before it's marked: the standard unrolls (paper); the scrape; the sliver lands on the pan; the punch (a thud);
#    the Hall arrives; the buyer sets the cup in the basket; the mark lifts to the present; the title on the horn's mark
bed('assay', [F, BBM7, F, CSUS], 0, cq('assay', 'breath'), g=0.036)
paper(W('assay', 'law', 'one standard', -0.3), 0.035, -0.3, 1.2)
tS = W('assay', 'test', 'leave'); scrape(tS - 0.35, 0.03, 0.25)
knock(tS + 0.85, 0.022, 0.4)
press(W('assay', 'test', 'marked', 0.05), 0.09)
knock(W('assay', 'hall', 'fourteen', 0.1), 0.03, -0.4)
soft(65, W('assay', 'hall', 'the hall', -0.1), 0.03, -0.3)
g0 = W('assay', 'buyer', 'Buyers', -0.3); knock(g0 + 3.4 + 0.5, 0.025, -0.2)
chorale([53, 57, 60, 65], W('assay', 'bridge', 'same promise', -0.2), 3.2, 0.022)
soft(60, W('assay', 'bridge', 'same promise', 1.5), 0.028, 0.3)
bed('assay', [F], cq('assay', 'breath'), g=0.04)
mark(G('assay', 'breath', 0.7), 53)
# 2. The gap register: a key for each line the agent types; gap 1 arrives; a knock for each decision; the badge goes (paper)
#    and comes back stamped; the decisions land; Mei's ticks as felt notes
bed('gaps', [F, DM7, BBM7, C, F])
lines(W('gaps', 'register', 'register', 0.3), 10, 0.42, 0.018, 0.3)
knock(G('gaps', 'revoked'), 0.035)
for k, word in enumerate(['Fix it', 'Write a rule', 'Or accept']):
    knock(W('gaps', 'three', word, -0.1), 0.032, -0.4 + k * 0.4)
paper(W('gaps', 'jordan', 'twelfth'), 0.03, 0.4, 0.8)
press(W('gaps', 'jordan', 'From that day', 0.6), 0.06)
lines(W('gaps', 'ten', 'ten decisions', -0.4), 10, 0.09, 0.016, 0.2)
for j in range(3):
    soft([60, 62, 65][j], W('gaps', 'ten', 'approves', j * 0.25), 0.03, 0.4)
# 3. The enterprise contract: a key per line of each card; the latch on "enforced"; the build fails (double knock), then passes
#    (felt); Noor's tick
bed('enterprise', [DM7, BBM7, C, F])
lines(G('enterprise', 'folder', 0.0), 7, 0.2, 0.018, -0.3)
latch(W('enterprise', 'folder', 'enforced'), 0.05, 0.2)
lines(G('enterprise', 'columns', -0.2), 17, 0.106, 0.016, 0.3)
fail(W('enterprise', 'stops', 'stops'), 0.05)
soft(53, G('enterprise', 'noor', 0.2), 0.035)
soft(60, W('enterprise', 'noor', 'approves', 0.2), 0.03, 0.4)
# 4. Two consumer contracts: the two marts arrive; the protected ring closes (paper); the exposure cards type; the lineage runs
#    to the wallet app (a swell, then a felt note); each consumer's tick
bed('consumer', [F, GM7, BBM7, C])
knock(G('consumer', 'own', 0.1), 0.035, -0.4); knock(G('consumer', 'own', 0.5), 0.035, 0.4)
paper(W('consumer', 'protected', 'protected', -0.2), 0.03, 0.0, 0.9)
latch(W('consumer', 'protected', 'enforced'), 0.035, 0.0)
lines(G('consumer', 'exposure', 0.0), 13, 0.123, 0.016, -0.4); lines(W('consumer', 'exposure', 'app', -0.1), 13, 0.108, 0.016, 0.4)
chorale([53, 57, 60], G('consumer', 'tell', 0.2), 2.4, 0.02)
soft(57, G('consumer', 'tell', 1.6), 0.035, 0.4)
soft(60, W('consumer', 'approve', 'Planning'), 0.03, -0.4); soft(65, W('consumer', 'approve', 'wallet team'), 0.03, 0.4)
# 5. Tests first: the order (a knock each); one key for each kind of test as it's named; the award card; the census table
#    and the scale; the reconciliation; Jun's tick
bed('tests', [F, AM7, DM7, BBM7, C])
knock(W('tests', 'step', 'the tests', -0.1), 0.03, 0.3); knock(W('tests', 'step', 'before the code', 0.1), 0.026, 0.5)
for lid, word in [('keys', 'unique'), ('keys', 'never empty'), ('keys', 'relationship'), ('values', 'closed list'), ('values', 'never overlap'), ('reconcile', 'compares')]:
    tap(W('tests', lid, word, -0.1), 0.024, -0.4)
lines(W('tests', 'values', 'agreed values', -0.2), 7, 0.17, 0.014, 0.3)
knock(G('tests', 'trusted', -0.1), 0.032, 0.0)
soft(57, W('tests', 'trusted', 'twelve'), 0.03, 0.0)
lines(G('tests', 'reconcile'), 7, 0.2, 0.014, 0.3)
soft(60, W('tests', 'agent', 'reviews', 0.2), 0.032, -0.4)
# 6. Logic, tested alone: the three boxes of a unit test; the given card types; the bars draw; the expect card's three rows
#    (felt notes, rising and falling with the credit); the unit test passes (a low felt note)
bed('unit', [DM7, BBM7, F, C])
for k, word in enumerate(['a few rows', 'purpose', 'unit test']):
    knock(W('unit', 'alone', word, -0.1), 0.026, 0.0 + k * 0.3)
lines(W('unit', 'rows', 'credit rule'), 9, 0.16, 0.014, 0.3)
for word in ['fifteen', 'twenty', 'fifteen again']:
    soft({'fifteen': 57, 'twenty': 60, 'fifteen again': 57}[word], W('unit', 'expect', word), 0.026, 0.2)
paper(W('unit', 'before', "Jordan's", -0.3), 0.025, -0.4)
soft(53, W('unit', 'before', 'proved'), 0.04, 0.4)
# 7. Warn or stop: the two levels arrive; the enrolment card; the counter crosses five (a double knock); today's warning
#    (one soft knock); the learning team's tick; the freshness card and its clock
bed('levels', [F, GM7, DM7, C, F])
knock(W('levels', 'not', 'warn', -0.1), 0.03, 0.3); knock(W('levels', 'not', 'stop the build', -0.1), 0.03, 0.3)
knock(G('levels', 'walkin', -0.3), 0.032, -0.4)
fail(W('levels', 'agreed', 'more than five'), 0.045, -0.3)
knock(G('levels', 'today', -0.1), 0.035, 0.0)
soft(60, W('levels', 'agreed', 'learning team', 0.6), 0.028, 0.4)
lines(G('levels', 'fresh', 0.0), 4, 0.22, 0.016, 0.3); knock(G('levels', 'fresh', 0.4), 0.028, 0.0)
soft(57, W('levels', 'owner', "The data's owner", -0.1), 0.03, 0.0)
# 8. Waiting, on purpose: the column of tests fills (a soft key per kind); the four unit tests; the end card on the horn's mark
bed('next', [F, BBM7, CSUS], 0, cq('next', 'breath'))
for i in range(7):
    tap(W('next', 'count', 'hundred', 0.3 + i * 0.22), 0.016, -0.4 + i * 0.05)
knock(W('next', 'count', 'Four unit', -0.2), 0.028, -0.3)
soft(53, W('next', 'red', 'on purpose', -0.1), 0.03, 0.3)
chorale(FSUS, G('next', 'green', -0.1), 3.0, 0.02)
bed('next', [F], cq('next', 'breath'), g=0.042)
mark(G('next', 'breath', 0.8), 53, 0.075)
