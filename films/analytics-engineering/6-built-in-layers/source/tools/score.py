# Built in layers: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# This film's palette, from the series plan: C major; the series' mark, 1-4-5-8, on a cello pizzicato (at the title and the end
# card); a close string-quartet pad for the bed. The 1890s kitchen has its own sounds: a knife on a board (a knock), a pan set down
# (a low thud), a plate slid to the pass (paper-soft). In the present: a CTE folding shut (soft paper), a layer lighting (a felt
# note), a test turning from red to green (a felt note, rising a fifth).
# The series' rules:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: the bed is sustained chords that change with the
#    chapters, so nothing in the background repeats or competes with the pictures.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, filtered below about 2.5 kHz: knocks, muffled keys, paper, felt notes, thuds.
# No chimes, pings, shimmers or bright clicks.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- the film's instruments ----
def pizz(m, start, g=0.06, pan=0.0, sec=1.6):
    """a cello pizzicato: a plucked string (Karplus-Strong), darkened, with a short woody body"""
    f = mf(m); N = max(2, int(round(SR / f))); L = int(sec * SR)
    y = np.zeros(L + N + 1, np.float32); y[:N + 1] = filt(noise((N + 1) / SR + 0.01)[:N + 1], 'low', 900)
    d = 0.996
    for s in range(N + 1, len(y), N):
        e = min(len(y), s + N); y[s:e] = d * 0.5 * (y[s - N:e - N] + y[s - N - 1:e - N - 1])
    y = y[N + 1:N + 1 + L]; x = tt(len(y) / SR)
    body = np.sin(2 * np.pi * f * x) * np.exp(-x * 3.2) * 0.6
    s = filt((y / (np.abs(y).max() + 1e-9) + body) * np.exp(-x * 1.8) * np.minimum(1, x / 0.004), 'low', 1800)
    put(norm(s.astype(np.float32)), start, g, pan)
def quartet(ch, start, sec, g=0.04):
    """the close string-quartet pad: a held chord, bowed"""
    pad(ch, start, sec, g, 'strings')
def bed(sid, chords, a=None, b=None, g=0.04, bassg=0.02):
    prog(sid, chords, a, b, g=g, tone='strings', bassg=bassg)
def mark(start, root, g=0.075):
    """the series' four notes, 1-4-5-8, rising, on the cello's open pizzicato"""
    for i, iv in enumerate([0, 5, 7, 12]):
        pizz(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)

# ---- soft sounds, all low-passed ----
def soft(m, start, g=0.035, pan=0.0):
    """a low felt note, for a moment that lands or a layer lighting"""
    felt(m, start, g, pan)
def fifth(start, m=55, g=0.022, pan=0.0):
    """a test turning green: a felt note, rising a fifth"""
    felt(m, start, g * 0.8, pan); felt(m + 7, start + 0.09, g, pan)
def knock(s, g=0.04, pan=0.0):
    """a soft wooden knock: a card or a node arriving, a knife on a board"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 220 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 480 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def dknock(s, g=0.04, pan=0.0):
    """a muted double knock: something refused"""
    knock(s, g, pan); knock(s + 0.13, g * 0.7, pan)
def tap(s, g=0.022, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def lines(t0, n, per, g=0.02, pan=0.2):
    """one muffled key per line, as lines are typed or lit"""
    for k in range(n):
        tap(t0 + k * per, g, pan)
def paper(s, g=0.035, pan=0.0, sec=0.45):
    """paper, softly: a card opening or folding shut, a plate slid along marble"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def lowthud(s, g=0.08):
    """a pan set down, a block of stone: a low thud, nothing bright"""
    thud(s, g)
def press(s, g=0.08):
    """an approval: a low thud and a knock"""
    thud(s, g); knock(s + 0.01, g * 0.4)

# chords (MIDI), C major and its neighbours, voiced close for a quartet
C = [48, 55, 60, 64]; CADD9 = [48, 55, 62, 64]; FMAJ7 = [41, 53, 57, 60, 64]; AM7 = [45, 52, 55, 60]; G6 = [43, 50, 55, 59, 64]
DM9 = [38, 50, 53, 57, 64]; EM7 = [40, 52, 55, 59]; GSUS = [43, 50, 55, 60, 62]; FADD9 = [41, 53, 55, 57, 60]

# 1. One station, one job: the Savoy's kitchen. A knock, a thud, a knife at each station as it works; the plate slid to the pass;
#    the chef's check; the four stations lighting in the layers' colours; the title on the cello's mark
bed('brigade', [AM7, FMAJ7, C, G6], 0, cq('brigade', 'breath'), g=0.036, bassg=0.018)
st = [W('brigade', 'stations', s) for s in ['sauces', 'roasts', 'fish', 'vegetables']]
knock(st[0], 0.028, -0.6)                      # a spoon against the copper pan
lowthud(st[1], 0.07)                           # the roasting tin set down
knock(st[2], 0.04, 0.1); knock(st[3], 0.04, 0.4)   # a knife on a board, once each
paper(W('brigade', 'ahead', 'every plate', -0.2), 0.035, 0.6, 0.8)   # the plate slid along to the pass
soft(55, W('brigade', 'ahead', 'checked', -0.3), 0.03, 0.7)          # the chef's hand on the plate
for k in range(4):
    soft([48, 52, 55, 60][k], W('brigade', 'bridge', 'four stations', k * 0.35), 0.026, -0.6 + k * 0.4)
soft(60, W('brigade', 'bridge', 'and a pass', 0.4), 0.03, 0.75)       # the tick on the pass
bed('brigade', [C], cq('brigade', 'breath'), bassg=0.024)
mark(G('brigade', 'breath', 0.7), 48)

# 2. Staging: the tests' names, grey, then red under the draft; one key per line as the draft is typed; Jun's approval;
#    the columns, staging lighting, its seven files; the layers table; the file's parts; no joins
bed('staging', [C, AM7, FMAJ7, G6])
lines(W('staging', 'red', 'tests'), 7, 0.2, 0.016, 0.5)
tR = W('staging', 'draft', 'watches them fail'); soft(43, tR, 0.035, 0.4)
for i in range(3):
    knock(tR + i * 0.24, 0.016, 0.5)
paper(G('staging', 'draft', -0.1), 0.028, -0.3)
dA = W('staging', 'draft', 'first draft'); lines(dA, 5, 0.44, 0.018, -0.2)
lines(W('staging', 'draft', 'least code'), 4, 0.45, 0.018, -0.2)
knock(W('staging', 'draft', 'Jun reviews', -0.2), 0.03, 0.6); press(W('staging', 'draft', 'every line', 0.2), 0.06)
knock(G('staging', 'first', -0.3), 0.035, -0.4); soft(52, W('staging', 'first', 'staging', -0.2), 0.03, -0.6)
chT = W('staging', 'first', 'seven')
for j in range(7):
    knock(chT - 0.6 + j * 0.23, 0.018, -0.7)
paper(W('staging', 'first', 'One model', -0.2), 0.03, 0.4)
paper(G('staging', 'job', -0.1), 0.03, 0.4); lines(G('staging', 'job', 0.0), 6, 0.27, 0.016, 0.4)
for word in ['renames', 'trims', 'readable key', 'hash']:
    knock(W('staging', 'job', word), 0.022, 0.3)
dknock(W('staging', 'nojoin', 'No joins', 0.4), 0.03, -0.6)
soft(57, W('staging', 'nojoin', 'still called a customer'), 0.028, -0.6)

# 3. Intermediate: the layer lighting; its eight steps; the conventions' line; four steps picked out; the customer becoming a
#    learner; the recipe, name by name
bed('intermediate', [AM7, DM9, FMAJ7])
soft(53, G('intermediate', 'steps', 0.2), 0.03, -0.3)
chT = W('intermediate', 'steps', 'Eight')
for j in range(8):
    knock(chT - 0.4 + j * 0.22, 0.016, -0.4)
paper(W('intermediate', 'steps', 'step, not a product', -0.2), 0.03, 0.4)
for s in ['Match', 'Stitch', 'Gather', 'Apply']:
    knock(W('intermediate', 'list', s, -0.2), 0.03, 0.4)
tw0 = W('intermediate', 'words', 'a customer'); paper(tw0, 0.025, -0.4, 0.9); soft(57, tw0 + 1.1, 0.03, -0.3)
paper(G('intermediate', 'recipe', -0.1), 0.03, 0.4)
lines(W('intermediate', 'recipe', 'top to bottom'), 11, 0.25, 0.014, 0.4)

# 4. Core: the blueprint; four nodes; the layer lighting; the contract locking; the tests turning green, each rising a fifth;
#    the award's line straight to the core; Noor's approval
bed('core', [C, FMAJ7, G6, C])
paper(W('core', 'names', 'blueprint', -0.3), 0.03, 0.4, 0.7)
soft(55, G('core', 'names', 0.2), 0.03, -0.2)
for word in ['learner', 'an award', 'a credential', 'credit towards']:
    knock(W('core', 'names', word, -0.2), 0.03, -0.2)
paper(G('core', 'contract', -0.2), 0.028, 0.4); knock(W('core', 'contract', 'enforced'), 0.035, 0.4)
gW = W('core', 'green', 'green')
for i in range(7):
    fifth(gW + i * 0.16, 55, 0.02, 0.3)
knock(G('core', 'award', 1.6), 0.03, -0.2); paper(G('core', 'award', 0.6), 0.03, 0.4)
knock(G('core', 'noor', -0.2), 0.025, 0.2); press(W('core', 'noor', 'her model'), 0.06)

# 5. Marts: the columns fold; the marts' three; the consumers; Planning's tall table, sorted by faculty; the wallet's wide row,
#    one tap; its YAML; the lines back to the core; the crossed-out arrow
bed('marts', [G6, C, AM7, FMAJ7])
paper(W('marts', 'one', 'shaped', -0.2), 0.03, 0.0, 1.0)
for j in range(3):
    knock(W('marts', 'one', 'marts', -0.2 + j * 0.33), 0.02, 0.6)
tB = max(W('marts', 'one', 'one consumer'), W('marts', 'one', 'shaped', 1.0))
knock(tB, 0.03, -0.6); knock(tB + 0.3, 0.03, 0.0)
paper(G('marts', 'fact', -0.3), 0.025, -0.6, 1.2)
paper(W('marts', 'fact', 'count by faculty', -0.2), 0.03, -0.5, 1.0); soft(52, W('marts', 'fact', 'count by faculty', 0.6), 0.028, -0.5)
lines(G('marts', 'wide', -0.1), 7, 0.26, 0.016, 0.4)
knock(W('marts', 'wide', 'one lookup'), 0.035, 0.3)
paper(W('marts', 'wide', 'one lookup', 0.8), 0.028, 0.4)
soft(55, W('marts', 'core', 'on the core'), 0.03, 0.0); soft(60, W('marts', 'core', 'on the core', 0.2), 0.024, 0.2)
dknock(W('marts', 'core', 'never', 0.3), 0.03, -0.2)

# 6. One CTE, one step: the word; the file, section by section, each folding shut as the next opens; the outline lighting;
#    cte2 struck out; one column traced back
bed('ctes', [FMAJ7, C, DM9, G6])
knock(W('ctes', 'open', 'CTE', -0.2), 0.03, -0.6)
paper(W('ctes', 'open', 'Open', 0.4), 0.03, -0.2); paper(W('ctes', 'open', 'named steps', -0.2), 0.02, 0.6)
for i in range(3):
    tap(W('ctes', 'import', 'one for each', i * 0.2), 0.02, -0.2)
paper(G('ctes', 'logical', -0.3), 0.035, -0.2)
dknock(W('ctes', 'logical', 'not CTE two'), 0.025, -0.1)
paper(G('ctes', 'final', -0.3), 0.035, -0.2)
soft(55, W('ctes', 'final', 'every column'), 0.026, -0.2)
paper(G('ctes', 'review', -0.2), 0.035, -0.2)
tr = W('ctes', 'review', 'every column')
for k, off in enumerate([-0.2, 0.4, 1.0]):
    soft([60, 57, 52][k], tr + off, 0.026, 0.6)

# 7. Physical choices: the columns; views turning to glass (felt), tables to stone (a thud); the config; the agent's query;
#    the incremental card; the merge; nothing to merge; clustered; rebuilt in full
bed('physical', [C, EM7, AM7, FMAJ7, G6])
knock(G('physical', 'how', 0.2), 0.03, -0.5)
paper(G('physical', 'views', -0.2), 0.028, 0.4)
soft(64, W('physical', 'views', 'views'), 0.028, -0.6); soft(60, W('physical', 'views', 'views', 0.1), 0.022, -0.4)
for i in range(4):
    tap(W('physical', 'views', 'query', 0.2 + i * 0.15), 0.02, -0.4)
lowthud(W('physical', 'tables', 'tables'), 0.06)
paper(G('physical', 'incr'), 0.03, 0.4)
soft(48, W('physical', 'incr', 'merges', 1.3), 0.034, -0.2)
soft(43, W('physical', 'incr', 'merges nothing'), 0.03, -0.2)
knock(W('physical', 'cluster', 'Databricks'), 0.025, 0.6)
paper(W('physical', 'cluster', 'clusters'), 0.025, -0.2, 1.0)
tf = W('physical', 'cluster', 'in full'); lines(tf - 0.2, 5, 0.2, 0.018, -0.4); lowthud(tf + 0.2, 0.06)

# 8. Metrics once: the columns fold; the macro; the var; one column, read twice; the metric; the pass, faculty by faculty;
#    twelve and twelve; each layer beside each station; the hand-off; the end card on the cello's mark
bed('once', [C, FMAJ7, DM9, GSUS, C, FADD9, G6], 0, cq('once', 'breath'))
paper(G('once', 'rule', 0.0), 0.028, 0.0, 1.0)
paper(G('once', 'rule', 0.6), 0.03, -0.3); lines(G('once', 'rule', 0.8), 6, 0.33, 0.016, -0.3)
knock(W('once', 'rule', 'fifteen', -0.3), 0.03, 0.6); soft(55, W('once', 'rule', 'fifteen', 0.3), 0.028, 0.5)
tM = W('once', 'count', 'the metric'); paper(tM - 0.3, 0.035, -0.3)
for i in range(4):
    knock(tM + 0.3 + i * 0.3, 0.025, -0.6 + i * 0.4)
soft(57, W('once', 'count', 'same column', -0.3), 0.03, 0.0)
paper(W('once', 'count', 'semantic layer', -0.3), 0.028, 0.0)
lowthud(G('once', 'pass', -0.2), 0.05); paper(G('once', 'pass'), 0.03, 0.0)
ff = W('once', 'pass', 'faculty by faculty')
for i in range(4):
    soft([52, 55, 57, 60][i], ff + i * 0.25, 0.022, -0.4 + i * 0.25)
soft(48, W('once', 'pass', 'twelve, and twelve'), 0.03, 0.5); soft(55, W('once', 'pass', 'and twelve'), 0.03, 0.5)
fifth(W('once', 'pass', 'Green', -0.2), 60, 0.03, 0.0)
quartet([48, 55, 60, 64], G('once', 'each', -0.3), 4.0, 0.03)
tN = G('once', 'next')
for i in range(4):
    knock(tN + 0.2 + i * 0.1, 0.02, -0.6 + i * 0.3)
knock(W('once', 'next', 'registrar', -0.2), 0.025, -0.4); knock(W('once', 'next', 'learning team', -0.2), 0.025, 0.0)
paper(W('once', 'next', 'Planning wants', -0.2), 0.03, 0.6, 0.8)
quartet([48, 55, 60, 64, 67], G('once', 'breath'), 6.0, 0.04); drone(36, G('once', 'breath'), 6.0, 0.024, 'strings')
mark(G('once', 'breath', 0.8), 48, 0.08)
