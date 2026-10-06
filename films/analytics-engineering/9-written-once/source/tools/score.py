# Written once: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series closes at home: D major, film 1's key, with a warm pad and strings under the present, and a felt piano for the
# series' mark, 1-4-5-8, at the title and the end, where film 1's electric piano answers it and the chord resolves on D major.
# Two rules, from the first cut's review:
#  - Nothing loops. No drum pulse, walking bass, repeated figure or random notes: the music is a bed of sustained chords that
#    change with the chapters, so nothing in the background repeats or competes with the pictures.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: knocks, muffled keys, paper, low felt notes and a thud for a stamp, filtered below about
# 2.5 kHz. Copies that drift are a detuned felt pair, low; a tuning fork's bright ring is never used. No chimes, pings or bells.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
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
    """copies drifting apart: two low felt notes a little out of tune with each other, once"""
    felt(m, start, g, -0.25); felt(m + 0.32, start + 0.05, g * 0.9, 0.25)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a node arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def dknock(s, g=0.05, pan=0.0):
    """a muted double knock: a check that fails, or something that breaks"""
    knock(s, g, pan); knock(s + 0.16, g * 0.8, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
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

# chords (MIDI note numbers): D major and its neighbours
DMAJ9 = [38, 45, 49, 52, 54]; GMAJ7 = [43, 50, 54, 59]; ASUS = [45, 52, 57, 59, 62]; BM7 = [47, 54, 57, 62]
EM9 = [40, 47, 50, 54, 55]; FSM7 = [42, 49, 52, 57]; DADD = [38, 45, 50, 52, 57]; GADD = [43, 50, 55, 57, 59]; A7 = [45, 52, 55, 61]
def mark(start, root, inst=fp, g=0.07):
    """the series' four notes, 1-4-5-8, rising"""
    for i, iv in enumerate([0, 5, 7, 12]):
        inst(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)

# 1. One note: strings in D; each fork set on the table (a knock); the three notes creeping apart (the detuned pair); the decree (paper)
#    and its seal (a stamp); the fork laid in its case (a low felt note); each copy stamped (a knock); the violin's string settling (a
#    felt note); the orchestra settling onto the oboe's A (a swell); the definition card (a knock); the title on the felt piano
bed('fork', [DADD, ASUS, GADD, DADD], 0, cq('fork', 'breath'), tone='strings')
for i in range(3):
    knock(S0('fork') + 0.2 + i * 0.45, 0.035, -0.4 + i * 0.4)
detuned(W('fork', 'drift', 'creeping'), 45, 0.04)
paper(G('fork', 'law'), 0.04, -0.3, 0.7); press(G('fork', 'law', 1.65), 0.06)
soft(45, W('fork', 'law', 'tuning fork', -0.2), 0.045, 0.2)
for k in range(4):
    knock(W('fork', 'copies', 'checked', k * 0.55 + 0.9), 0.03, -0.1 + k * 0.15)
soft(57, W('fork', 'copies', 'tuned from those', 0.3), 0.03, 0.5)
swell([45, 52, 57, 64], W('fork', 'today', 'tunes', -0.6), 3.4, 0.03)
knock(W('fork', 'bridge', 'kept in one place', 0.6), 0.035, 0.4)
bed('fork', [DMAJ9], cq('fork', 'breath'), tone='strings', bassg=0.026)
mark(G('fork', 'breath', 0.7), 62)
# 2. Four copies: the review card (a knock); the one card spreading into four (a knock); a knock as each copy is named; the copies
#    turning amber as they drift (the detuned pair, once); the conceptual model drawn in (paper); Mei's tick (a felt note); nothing kept them in step (a knock)
bed('four', [DMAJ9, BM7, EM9, ASUS])
knock(S0('four') + 0.6, 0.035, 0.3)
knock(W('four', 'review', 'four places', -0.2), 0.03, 0.3)
for word, pan in [('wiki', -0.5), ('YAML description', -0.5), ('catalog', -0.5)]:
    knock(W('four', 'found', word, -0.3), 0.032, pan)
knock(W('four', 'found', 'tooltip', -0.4), 0.032, 0.0)
detuned(W('four', 'drift', 'on paper'), 47, 0.035)
paper(W('four', 'one', 'conceptual model', -0.3), 0.035, 0.5)
soft(62, W('four', 'one', 'Mei approved'), 0.035, 0.5)
knock(G('four', 'step'), 0.03, -0.5); knock(W('four', 'step', 'one small edit'), 0.028, -0.3)
# 3. What goes where: the fifth copy crossed out (a knock); the home lighting (paper); the business glossary (a knock), muffled keys
#    as the conceptual model writes where its words came from, and data governance's tick (felt); muffled keys as the decision log
#    and the gaps are written; a knock for each thing the build uses; a felt note for why
bed('where', [GMAJ7, DMAJ9, BM7, GADD, ASUS])
knock(W('where', 'fifth', 'or a better', -0.1), 0.035, -0.2)
paper(G('where', 'meaning', -1.0), 0.035, 0.0, 0.8)
knock(W('where', 'glossary', 'business glossary', -0.3), 0.03, -0.2)
lines(W('where', 'glossary', 'Data governance'), 5, 0.44, 0.016, 0.2)
soft(62, W('where', 'glossary', 'Data governance'), 0.032, -0.3)
lines(W('where', 'why', 'Decisions'), 5, 0.3, 0.018, -0.4)
lines(W('where', 'why', 'gaps'), 4, 0.28, 0.018, -0.4)
for word in ['grain', 'keys', 'contracts', 'tests', 'owners']:
    knock(W('where', 'build', word, -0.1), 0.026, 0.4)
lines(W('where', 'build', 'grain', 0.6), 6, 0.3, 0.016, 0.4)
soft(57, W('where', 'log', 'It holds why'), 0.035, -0.3)
# 4. Written once, shown everywhere: a knock as each link of the chain appears; muffled keys as the script writes the page; a felt
#    note as the docs site shows the definition; Mei's tick; the failing check (a muted double knock) and the fix (two felt notes);
#    the review's result (a knock and a note); the wiki's copy replaced (paper)
bed('blocks', [DMAJ9, GMAJ7, BM7, ASUS, DMAJ9])
for tm in [S0('blocks') + 0.4, G('blocks', 'script'), W('blocks', 'script', 'Markdown page', -0.2), G('blocks', 'points'), W('blocks', 'points', 'dbt shows')]:
    knock(tm, 0.03, 0.0)
lines(S0('blocks') + 0.9, 5, 0.36, 0.016)
lines(G('blocks', 'script'), 9, 0.29, 0.02, 0.0)
lines(W('blocks', 'script', 'Markdown page'), 8, 0.27, 0.018, 0.2)
soft(62, W('blocks', 'points', 'dbt shows', 0.5), 0.03, 0.4)
soft(62, W('blocks', 'change', "Mei's approval"), 0.035, -0.4)
lines(W('blocks', 'change', 'generated page'), 4, 0.22, 0.02, 0.4)
dknock(W('blocks', 'change', 'check in CI'), 0.045, 0.4)
soft(57, W('blocks', 'change', 'check in CI', 1.2), 0.03, 0.4); soft(62, W('blocks', 'change', 'check in CI', 1.4), 0.03, 0.4)
knock(G('blocks', 'zero'), 0.03, -0.2); soft(57, W('blocks', 'zero', 'no description'), 0.03, -0.2)
paper(W('blocks', 'zero', 'wiki now links'), 0.035, 0.5)
# 5. Diagrams that can't drift: the old diagram going amber (the detuned pair); keys as each file types; the diagram going stale and
#    the check failing (a muted double knock); the script running (keys) and the check passing (felt); the rule, two felt notes
bed('diagrams', [EM9, ASUS, DMAJ9, GMAJ7])
detuned(W('diagrams', 'too', 'drift', -0.2), 45, 0.03)
lines(G('diagrams', 'hand'), 8, 0.3, 0.016, -0.4)
lines(G('diagrams', 'generated'), 6, 0.33, 0.016, 0.4)
dknock(W('diagrams', 'fails', 'YAML changes', 0.4), 0.04, 0.4)
lines(W('diagrams', 'fails', 'YAML changes', 1.6), 4, 0.18, 0.016, 0.4)
soft(62, W('diagrams', 'fails', 'YAML changes', 2.4), 0.032, 0.4)
soft(50, W('diagrams', 'rule', 'Draw the meaning'), 0.04, -0.4); soft(57, W('diagrams', 'rule', 'Generate the structure'), 0.04, 0.4)
# 6. One direction: the catalog (a knock) and its search (keys); the descriptions flowing out (a swell); the hand's edit (keys) and
#    the rebuild writing over it (paper); the fix flowing from home (a felt note); upstream, the glossary (a knock), the pull request
#    (a knock) and the owner's tick (felt); the dashboard (a knock); the fork, once more (felt)
bed('catalog', [DMAJ9, FSM7, GMAJ7, DADD])
knock(S0('catalog') + 0.3, 0.035, 0.4)
lines(W('catalog', 'find', 'catalog'), 5, 0.16, 0.016, 0.4)
swell([50, 57, 62, 66], W('catalog', 'push', 'pushes', -0.2), 2.6, 0.022)
lines(W('catalog', 'there', 'Nobody edits'), 5, 0.2, 0.018, 0.4)
paper(W('catalog', 'there', 'writes over'), 0.04, 0.4, 0.9)
soft(62, W('catalog', 'there', 'Fix it at home', 0.4), 0.032, -0.3)
knock(G('catalog', 'upstream', -0.2), 0.03, -0.3)
knock(W('catalog', 'upstream', 'opens a pull request'), 0.03, -0.5)
soft(62, W('catalog', 'upstream', 'the owner'), 0.032, -0.4)
knock(W('catalog', 'gate', 'whatever reads it', -0.2), 0.03, 0.4)
soft(45, W('catalog', 'gate', 'Tuned from', -0.3), 0.04, -0.4)
# 7. The next version: the card (a knock); the status a true or false can't hold (felt); the old column breaking (a muted double
#    knock); the new version's stamp (a low stamp); keys as the versions and the SQL type; the date's stamp; a knock for each model
#    downstream; the wallet's tick (felt); the warning (a muted knock, then keys); the decision (paper) and two approvals (felt)
bed('version', [DMAJ9, BM7, EM9, A7, GMAJ7, DMAJ9])
knock(S0('version') + 0.6, 0.035, -0.4)
soft(57, W('version', 'expire', 'becomes', -0.2), 0.032, 0.2)
dknock(G('version', 'breaks'), 0.04, 0.4)
press(W('version', 'breaks', 'new version', -0.2), 0.07)
lines(W('version', 'breaks', 'new version'), 7, 0.34, 0.016, 0.4)
press(W('version', 'date', 'date to go', 0.1), 0.06)
lines(W('version', 'date', 'built from'), 6, 0.27, 0.016, 0.4)
for d in [0, 0.25, 0.6]:
    knock(W('version', 'tell', 'exposures', d), 0.028, 0.2)
soft(62, W('version', 'tell', 'only the wallet', -0.2), 0.03, 0.5)
lines(W('version', 'tell', 'say who'), 2, 0.4, 0.016, 0.2)
soft(66, W('version', 'tell', 'pins', 0.8), 0.03, 0.5)
knock(G('version', 'warn', -0.2), 0.03, -0.4)
lines(W('version', 'warn', "dbt's warning"), 4, 0.5, 0.016, -0.4)
paper(G('version', 'choice'), 0.035, 0.4)
soft(57, G('version', 'choice', 1.2), 0.032, 0.2); soft(62, G('version', 'choice', 1.5), 0.032, 0.4)
# 8. The loop closes: a knock as each station lights; a swell as the agent's dots and the people's ticks appear; the new question
#    (paper, and a felt note at the first station); the blueprint settling (a swell); the end: the mark on the felt piano, answered
#    by film 1's electric piano, resolving on D major
bed('loop', [DMAJ9, GMAJ7, BM7, ASUS], 0, cq('loop', 'breath'))
for word in ["A question", "the sources", "the consumers", "gaps and", "tests", "layers", "trusted number", "review", "written once", "and change"]:
    knock(W('loop', 'steps', word, -0.1), 0.028)
swell([50, 57, 62, 66, 69], W('loop', 'approved', 'drafted'), 4.0, 0.022)
soft(55, W('loop', 'approved', 'a person'), 0.04); soft(62, W('loop', 'approved', 'a person', 0.2), 0.03)
paper(W('loop', 'new', 'new question', -0.2), 0.035, 0.3); soft(62, W('loop', 'new', 'new question', 0.4), 0.032, 0.0)
swell([50, 57, 62, 66], G('loop', 'declare', -0.3), 3.0, 0.024)
pad([50, 57, 61, 64, 66], G('loop', 'breath'), 4.6, 0.04, 'strings'); drone(38, G('loop', 'breath'), 4.6, 0.026, 'strings')
mark(G('loop', 'breath', 0.2), 62, fp, 0.07)
mark(G('loop', 'breath', 1.7), 62, lambda m, s, g, pan: ep(m, s, g, pan, sec=2.2), 0.06)
