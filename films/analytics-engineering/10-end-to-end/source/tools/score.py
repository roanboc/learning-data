# End to end: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series closes here. The tracing floor is in D Dorian, open fifths on strings, like a stone nave; the present is D major,
# film 1's key, with a warm pad; and the end is the series' mark, 1-4-5-8, on the felt piano, answered by film 1's electric
# piano, resolving on D major. The title plays the mark once, on the felt piano alone.
# The same two rules as film 9:
#  - Nothing loops. No drum pulse, walking bass, repeated figure or random notes: the music is a bed of sustained chords that
#    change with the chapters, so nothing in the background repeats or competes with the pictures.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: knocks, muffled keys, paper, a dividers' point and a chisel, low felt notes and a thud for
# a stamp, filtered below about 2.5 kHz. Copies counted twice are a detuned felt pair, low. No chimes, pings or bells.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- soft sounds, all low-passed ----
def fp(m, start, g=0.05, pan=0.0):
    """a felt piano: a felt hammer on a string, its partials falling fast, and a soft thump, all below 2 kHz"""
    f = mf(m); x = tt(3.6)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * np.exp(-x * (0.9 + 0.7 * k)) * w for k, w in ((1, 1), (2, 0.4), (3, 0.16), (4, 0.06), (5, 0.02)))
    s = s * np.minimum(1, x / 0.012) + 0.08 * filt(noise(3.6), 'low', 400) * np.exp(-x * 40)
    put(norm(filt(s.astype(np.float32), 'low', 2000)), start, g, pan)
def ep(m, start, g=0.05, pan=0.0, sec=2.8):
    """film 1's mellow electric piano: the FM tone without the bright tine, filtered"""
    f = mf(m); x = tt(sec); idx = 1.1 * np.exp(-x * 3.5) + 0.2
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) * np.exp(-x * 0.9) * np.minimum(1, x / 0.01) * (1 + 0.1 * np.sin(2 * np.pi * 4.5 * x))
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def detuned(start, m=45, g=0.035):
    """the same credit counted again: two low felt notes a little out of tune with each other, once"""
    felt(m, start, g, -0.25); felt(m + 0.32, start + 0.05, g * 0.9, 0.25)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a node arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def dknock(s, g=0.05, pan=0.0):
    """a muted double knock: a check that fails"""
    knock(s, g, pan); knock(s + 0.16, g * 0.8, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell. Also a line struck through, and a file let go"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def press(s, g=0.1):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')
def lines(t0, n, per, g=0.02, pan=-0.3):
    """one muffled key per line of a file, as each line is typed or written"""
    for k in range(n):
        tap(t0 + k * per, g, pan)
def scrape(s, g=0.03, pan=0.0, sec=0.9):
    """a dividers' point drawn through plaster: a dry, low scrape"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1200)) * np.sin(np.pi * x / sec) ** 1.5 * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * x)), s, g, pan)
def chisel(s, g=0.04, pan=0.0):
    """a mallet on a chisel, muffled by the stone: a low knock and a short grit"""
    x = tt(0.14); X(norm(filt((np.sin(2 * np.pi * 300 * x) * np.exp(-x * 45)).astype(np.float32) + 0.5 * filt(noise(0.14), 'band', (400, 1800)) * np.exp(-x * 70), 'low', 1800)), s, g, pan)
def trowel(s, g=0.035, pan=0.0, sec=1.8):
    """a trowel spreading fresh plaster: a long, smooth hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (150, 900)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)

# chords (MIDI note numbers). The floor: D Dorian, open fifths. The present: D major and its neighbours
DDOR = [38, 45, 50, 57, 64]; CFIF = [36, 43, 48, 55, 62]; AMIN = [45, 52, 57, 60, 64]; GFIF = [43, 50, 55, 59, 62]
DMAJ9 = [38, 45, 49, 52, 54]; GMAJ7 = [43, 50, 54, 59]; ASUS = [45, 52, 57, 59, 62]; BM7 = [47, 54, 57, 62]
EM9 = [40, 47, 50, 54, 55]; FSM7 = [42, 49, 52, 57]; DADD = [38, 45, 50, 52, 57]; GADD = [43, 50, 55, 57, 59]; A7 = [45, 52, 55, 61]
def mark(start, root, inst=fp, g=0.07):
    """the series' four notes, 1-4-5-8, rising"""
    for i, iv in enumerate([0, 5, 7, 12]):
        inst(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)

# 1. The tracing floor: strings in D Dorian. The dividers' point scraping the window into the plaster; a knock as the template is
#    lifted; the chisel as the stone is carved; the rose scraped over the window; the trowel as the floor is plastered again; a swell
#    and a felt note as the window stands in stone; the work's files (knocks, then struck through, paper) and the files that stay
#    (knocks, lower); the title on the felt piano, as D Dorian turns to D major
B1 = cq('floor', 'breath')
bed('floor', [DDOR, CFIF, AMIN, GFIF, DDOR, DADD], 0, B1, tone='strings', bassg=0.024)
d0, d1 = G('floor', 'drew', 0.9), G('floor', 'templates', -1.2)
for k in range(4):
    scrape(d0 + k * (d1 - d0) / 4, 0.026, -0.4 + k * 0.2)
knock(W('floor', 'templates', 'wooden template', 0.3), 0.035, 0.4)
for k in range(6):
    chisel(W('floor', 'templates', 'carved', -0.2 + k * 0.36), 0.032, 0.5)
r0, r1 = G('floor', 'over', 0.2), W('floor', 'over', 'plastered again', -0.4)
for k in range(3):
    scrape(r0 + k * (r1 - r0) / 3, 0.024, 0.0 + k * 0.15, 0.8)
trowel(W('floor', 'over', 'plastered again', -0.2), 0.04, -0.2, 2.0)
swell([50, 57, 62, 66], G('floor', 'stayed', -0.2), 3.2, 0.026)
soft(57, W('floor', 'stayed', 'The windows'), 0.032, 0.5)
for i in range(3):
    knock(W('floor', 'bridge', 'files for the work', i * 0.25), 0.028, -0.4)
    paper(W('floor', 'bridge', 'deleted', i * 0.2), 0.026, -0.4, 0.35)
    knock(W('floor', 'bridge', 'files that stay', i * 0.25), 0.034, 0.4)
soft(50, W('floor', 'bridge', 'one new question'), 0.035, 0.0)
bed('floor', [DMAJ9], B1, tone='strings', bassg=0.026)
mark(G('floor', 'breath', 0.7), 62)

# 2. A new question: Finance arriving (a knock) with its question card (a knock); the question written (paper); what it decides (a
#    felt note); the three kinds of domain (a knock), the business domain lit (a felt note) and its two folders (knocks); keys as
#    the conceptual model, the decision log and the temporary requirements file are written; the backlog and what stays open (knocks)
bed('question', [DMAJ9, BM7, GMAJ7, ASUS, DMAJ9])
knock(S0('question') + 0.4, 0.035, 0.5)
knock(W('question', 'arrives', 'Finance', -0.2), 0.03, 0.0)
paper(G('question', 'asks'), 0.032, 0.2, 0.7)
soft(57, G('question', 'decides', 0.2), 0.028, 0.2)
knock(G('question', 'kind', -0.2), 0.026, 0.0)
soft(62, W('question', 'kind', 'business domain'), 0.03, 0.5)
for i in range(2):
    knock(W('question', 'kind', 'folders', i * 0.3), 0.028, 0.4)
knock(G('question', 'files', -0.2), 0.03, 0.2)
lines(G('question', 'files'), 6, 0.27, 0.017, 0.2)
knock(W('question', 'files', 'decision log', -0.2), 0.028, -0.2)
lines(W('question', 'files', 'decision log'), 6, 0.23, 0.016, -0.2)
paper(G('question', 'open', -0.1), 0.03, 0.4)
lines(G('question', 'open'), 8, 0.2, 0.016, 0.4)
soft(45, W('question', 'open', "won't last"), 0.03, 0.4)
knock(G('question', 'backlog'), 0.026, -0.2)
knock(W('question', 'backlog', "only what's still open"), 0.026, 0.4)

# 3. What the core holds: the agent's profile query (a knock, then keys); the core lit, not the sources (a knock); Aisha (a knock)
#    and the three awards her credit counts towards (knocks); 385, the same credit counted again (the detuned pair, once); 160 (a
#    felt note); the question opened (paper, keys); Finance owns the answer (a felt note); the rates (a knock, keys, a knock)
bed('sources', [EM9, ASUS, BM7, GMAJ7, DMAJ9])
knock(W('sources', 'profile', 'profiles the core', -0.6), 0.03, 0.3)
lines(W('sources', 'profile', 'profiles the core', -0.4), 9, 0.18, 0.016, 0.3)
knock(W('sources', 'profile', 'not the sources'), 0.026, 0.0)
knock(G('sources', 'across', -0.1), 0.032, -0.3)
for i in range(3):
    knock(W('sources', 'across', 'counts towards three', i * 0.3), 0.028, 0.2 + i * 0.15)
detuned(W('sources', 'numbers', 'Added up'), 45, 0.034)
soft(62, W('sources', 'numbers', 'enrolled in'), 0.032, 0.3)
paper(G('sources', 'which'), 0.03, 0.3)
lines(G('sources', 'which'), 7, 0.23, 0.016, 0.3)
soft(57, W('sources', 'which', 'Finance owns'), 0.03, -0.3)
knock(G('sources', 'rates'), 0.03, 0.3)
lines(G('sources', 'rates', 0.2), 5, 0.28, 0.016, 0.3)
knock(W('sources', 'rates', 'reference data'), 0.026, 0.0)

# 4. One row of what: Finance's answer (a knock); the three awards (knocks), the one Aisha is enrolled in lit (a felt note); the
#    rule and the decision written (knocks); the open question struck through (paper) and let go; the grain in one sentence (a
#    swell); the output requirement, open until a contract enforces it (paper, keys)
bed('output', [GMAJ7, DMAJ9, BM7, ASUS, DMAJ9])
knock(S0('output') + 0.5, 0.032, 0.0)
for i in range(3):
    knock(W('output', 'answer', 'First', i * 0.2), 0.026, -0.3 + i * 0.3)
soft(62, W('output', 'answer', 'enrolled in', 0.3), 0.032, -0.3)
knock(G('output', 'moves', -0.2), 0.03, 0.2)
knock(W('output', 'moves', 'a decision'), 0.03, -0.2)
paper(W('output', 'moves', 'a decision', 0.2), 0.026, 0.4)
paper(W('output', 'deleted', 'question is deleted'), 0.034, 0.4, 0.6)
knock(W('output', 'deleted', 'Git keeps'), 0.024, 0.3)
swell([50, 57, 62, 66], G('output', 'grain', -0.2), 3.0, 0.022)
paper(G('output', 'until', -0.1), 0.03, 0.0)
lines(G('output', 'until'), 4, 0.3, 0.016, 0.0)

# 5. The promise: keys as the contract's columns appear, and a stamp as it's enforced; the empty table (a knock) and the forecast
#    that depends on it (a knock); the gap (a low felt note, and a knock for what's missing); Finance accepts (a felt note), the
#    limitation and its decision written (a knock, keys)
bed('promise', [DMAJ9, FSM7, BM7, EM9, ASUS])
knock(S0('promise') + 0.4, 0.03, 0.2)
lines(W('promise', 'contract', 'columns'), 6, 0.2, 0.016, 0.2)
press(W('promise', 'contract', 'enforced', 0.3), 0.06)
knock(W('promise', 'empty', 'right shape'), 0.028, 0.0)
knock(W('promise', 'empty', 'the forecast'), 0.028, 0.4)
soft(45, G('promise', 'gap', 0.2), 0.034, -0.2)
knock(W('promise', 'gap', 'Scholarships'), 0.024, 0.2)
soft(62, W('promise', 'accept', 'Finance accepts', 0.4), 0.032, -0.3)
knock(W('promise', 'accept', 'known limitation'), 0.028, 0.2)
lines(W('promise', 'accept', 'known limitation', 0.2), 6, 0.2, 0.016, 0.2)
paper(W('promise', 'accept', 'decision'), 0.026, 0.3)

# 6. Tests first: keys as the tests are written, a knock as each is named; the unit test (a knock) and its rule (a felt note); the
#    report (a knock, keys), the seed no model may read (a knock), the reconciliation's nodes (knocks); the build failing on purpose
#    (keys, a muted double knock) and the mart skipped (a knock); REQ-FIN-02 struck through (paper), and done (a felt note)
bed('tests', [EM9, ASUS, DMAJ9, A7, GMAJ7, DMAJ9])
lines(G('tests', 'grain', -0.2), 13, 0.18, 0.015, 0.2)
for word in ['tested as a key', 'Learners that exist', 'award types']:
    knock(W('tests', 'grain', word, -0.1), 0.026, 0.3)
knock(G('tests', 'unit'), 0.03, 0.2)
lines(G('tests', 'unit', 0.2), 8, 0.16, 0.015, 0.2)
soft(57, W('tests', 'unit', 'still saves'), 0.03, 0.2)
knock(G('tests', 'report'), 0.03, 0.2)
lines(G('tests', 'report', 0.1), 5, 0.28, 0.016, 0.2)
knock(W('tests', 'report', 'no model may read'), 0.026, 0.0)
for i in range(3):
    knock(W('tests', 'report', 'reconciliation', i * 0.3), 0.026, -0.3 + i * 0.3)
lines(G('tests', 'fail', -0.2), 3, 0.2, 0.018, 0.3)
dknock(W('tests', 'fail', 'unit test fails'), 0.042, 0.3)
knock(W('tests', 'fail', "doesn't even build"), 0.026, 0.5)
paper(W('tests', 'done', 'deleted'), 0.032, 0.0, 0.5)
soft(62, W('tests', 'done', 'grain is tested'), 0.03, 0.0)

# 7. The build: keys as the SQL is written, a knock as each part is named; the public core and Finance's rates flowing into the mart
#    (a swell); the other teams' marts, untouched (two soft knocks); the hard parts (a felt note); every test passing (two felt
#    notes), a knock per faculty's bar, and the total (a felt note)
bed('build', [DMAJ9, GMAJ7, BM7, ASUS, DMAJ9])
lines(S0('build') + 0.6, 13, (G('build', 'only', -1.2) - S0('build') - 0.6) / 13, 0.015, 0.2)
for word in ['as it was', 'keeps the award', 'prices the credit']:
    knock(W('build', 'reads', word), 0.026, 0.3)
swell([50, 57, 62, 66], W('build', 'only', 'public core', -0.2), 2.6, 0.022)
knock(W('build', 'only', 'No other team'), 0.022, 0.4); knock(W('build', 'only', 'No other team', 0.25), 0.02, 0.5)
soft(57, W('build', 'short', 'hard parts'), 0.03, -0.2)
soft(57, W('build', 'green', 'dollars', -0.4), 0.034, 0.2); soft(62, W('build', 'green', 'dollars', -0.2), 0.034, 0.3)
for i in range(4):
    knock(W('build', 'green', 'dollars', 0.3 + i * 0.2), 0.022, -0.2 + i * 0.15)
soft(66, W('build', 'green', 'four faculties'), 0.03, 0.4)

# 8. Nothing else moved: the reconciliation's table (a knock, a key per row) and its zeros (a felt note); the diff against main (a
#    knock, a key per table) and its zeros (a swell); a new consumer moved nobody else's numbers (a felt note); Finance signs off
#    (two felt notes)
bed('validate', [DMAJ9, BM7, GMAJ7, ASUS, DMAJ9])
knock(S0('validate') + 0.4, 0.03, 0.2)
lines(S0('validate') + 0.8, 4, 0.3, 0.018, 0.2)
soft(62, W('validate', 'reconcile', 'is zero'), 0.032, 0.2)
knock(G('validate', 'diff'), 0.03, 0.2)
lines(G('validate', 'diff', 0.4), 7, 0.25, 0.016, 0.2)
swell([50, 57, 62, 66], W('validate', 'nothing', 'No key added'), 2.6, 0.022)
soft(57, W('validate', 'nothing', 'A new consumer'), 0.03, 0.3)
soft(57, W('validate', 'signoff', 'signs off', 0.3), 0.032, -0.2); soft(62, W('validate', 'signoff', 'signs off', 0.5), 0.03, -0.2)

# 9. Review and ship: the pull request (a knock); the last item struck through (keys) and done (a knock); the file let go (paper),
#    and its folder (paper); each check in CI (a knock, then a felt note as it passes); the requirements check run (keys); two
#    approvals (felt notes) and the agent, who never merges (a knock)
bed('ship', [GMAJ7, DMAJ9, EM9, ASUS, DMAJ9])
knock(S0('ship') + 0.4, 0.032, 0.0)
paper(G('ship', 'last', -0.2), 0.028, -0.2)
lines(W('ship', 'last', 'is done'), 3, 0.2, 0.018, -0.2)
knock(W('ship', 'last', 'the reconciliation'), 0.026, -0.2)
knock(W('ship', 'gone', 'deleted'), 0.026, -0.6)
paper(W('ship', 'gone', "Finance's requirements file"), 0.036, -0.2, 0.8)
paper(W('ship', 'gone', 'its folder'), 0.03, -0.2, 0.6)
for i, m in enumerate([50, 54, 57, 62, 66]):
    knock(G('ship', 'check', -0.4 + i * 0.25), 0.022, 0.5)
    soft(m, G('ship', 'check', -0.1 + i * 0.25), 0.018, 0.5)
lines(W('ship', 'check', 'nothing stays'), 4, 0.15, 0.016, 0.5)
soft(57, W('ship', 'approve', 'Jun approves', 0.4), 0.032, -0.4)
soft(62, W('ship', 'approve', 'Finance its number', 0.4), 0.032, 0.0)
knock(W('ship', 'approve', 'never merges'), 0.026, 0.4)

# 10. Written once: the agent's review typed (keys); the same description written twice (the detuned pair, once); one doc block in
#     the course domain (a knock, keys, a felt note); shown in Finance's and Planning's YAML (knocks); none written twice (two felt
#     notes); the generated pages, keeping up on their own (soft knocks)
bed('once', [DMAJ9, FSM7, GMAJ7, ASUS, DMAJ9])
lines(S0('once') + 0.8, 8, (G('once', 'two', 1.0) - S0('once') - 0.8) / 8, 0.016, 0.2)
detuned(W('once', 'two', 'word for word'), 47, 0.032)
knock(G('once', 'home'), 0.03, -0.2)
lines(G('once', 'home', 0.2), 7, 0.18, 0.015, -0.2)
soft(55, W('once', 'home', 'course domain'), 0.03, -0.2)
for i in range(2):
    knock(W('once', 'home', 'shown everywhere', i * 0.3), 0.026, 0.4)
soft(57, G('once', 'zero'), 0.03, 0.0); soft(62, G('once', 'zero', 0.2), 0.03, 0.0)
for i in range(3):
    knock(W('once', 'zero', 'generated pages', i * 0.3), 0.02, 0.2)

# 11. Ready to move: the pinned refs (a knock, then a stamp); version 1 and version 2 (knocks), the choice with a date (paper); who
#     to tell (a felt note); Finance's folders (a key each), gathering into a project of its own (a swell); nothing else needs
#     untangling (two felt notes)
bed('evolve', [DMAJ9, BM7, EM9, A7, GMAJ7, DMAJ9])
knock(S0('evolve') + 0.4, 0.03, 0.2)
press(W('evolve', 'pin', 'pins'), 0.05)
for i in range(2):
    knock(G('evolve', 'choice', i * 0.4), 0.026, -0.3)
paper(G('evolve', 'choice', 0.5), 0.026, 0.0)
soft(62, W('evolve', 'choice', 'who to tell'), 0.03, 0.3)
for i in range(5):
    tap(G('evolve', 'move', 0.2 + i * 0.18), 0.022, -0.3)
swell([50, 57, 62, 66], W('evolve', 'list', 'Its marts', -0.2), 2.4, 0.024)
soft(57, W('evolve', 'list', 'Nothing else'), 0.032, 0.2); soft(62, W('evolve', 'list', 'Nothing else', 0.2), 0.03, 0.2)

# 12. The whole building: keys as the log is written; a knock for each file that stayed; the work's items struck through (paper);
#     the three kinds of domain (a knock and a felt note each, rising); the three lifetimes (felt notes); the next question (paper),
#     its folders (knocks) and its one temporary file (paper); a knock as each film of the series is named, a swell as the loop
#     closes; the blueprint (a swell); then the end: the mark on the felt piano, answered by film 1's electric piano, on D major
B12 = cq('building', 'breath')
bed('building', [DMAJ9, GMAJ7, BM7, EM9, ASUS, GMAJ7, DMAJ9], 0, B12)
lines(S0('building') + 0.5, 10, 0.18, 0.016, 0.0)
for i in range(6):
    knock(G('building', 'stay', 0.1 + i * 0.2), 0.026, -0.4)
for i in range(4):
    paper(W('building', 'work', "They're gone", i * 0.15), 0.022, 0.4, 0.4)
for i, (word, m) in enumerate([('Sources by system', 50), ('The core by meaning', 54), ('Marts and exposures', 57)]):
    knock(W('building', 'homes', word, -0.2), 0.028, -0.5 + i * 0.5); soft(m, W('building', 'homes', word), 0.024, -0.5 + i * 0.5)
for i, (word, m) in enumerate([('written by hand', 57), ('generated', 62), ('kept only', 45)]):
    soft(m, W('building', 'lives', word, -0.1), 0.024, -0.5 + i * 0.5)
paper(G('building', 'next'), 0.03, 0.0)
for i in range(2):
    knock(W('building', 'next', 'folders of its own', i * 0.3), 0.024, 0.0)
paper(W('building', 'next', 'one file'), 0.026, 0.0)
for word in ['A question', 'the sources', 'the consumers', 'promises', 'proofs', 'layers', 'trusted number', 'an agent', 'written once', 'change']:
    knock(W('building', 'series', word, -0.1), 0.026)
swell([50, 57, 62, 66, 69], W('building', 'series', 'change', 0.4), 3.6, 0.022)
swell([50, 57, 62, 66], G('building', 'blueprint', -0.1), 3.0, 0.022)
swell([50, 57, 62, 66], G('building', 'declare', -0.3), 3.0, 0.024)
pad([50, 57, 61, 64, 66], G('building', 'breath'), 4.6, 0.04, 'strings'); drone(38, G('building', 'breath'), 4.6, 0.026, 'strings')
mark(G('building', 'breath', 0.2), 62, fp, 0.07)
mark(G('building', 'breath', 1.7), 62, lambda m, s, g, pan: ep(m, s, g, pan, sec=2.2), 0.06)
