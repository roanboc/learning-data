# Keeping it true: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# The film's palette is time and care: string swells over a ticking clock at 60 beats a minute, with a felt piano, in C major.
# The drift chapters (how models go stale, the agent watching, what can go wrong) lean into A minor; the decisions and the end
# to end return to C. In the last chapter the series comes home: its motif on the kalimba in D (What's in a word's key and
# instrument), answered by a tubular bell (Older than the systems), resolving on a warm D major chord.
# Effects: pages for the dictionary, clock ticks, a pencil's scratch, stamps for approvals, glitches for drift, glassy nodes when
# the agent notices something, chimes for tests that pass, and a seal when version three is approved.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# chords (MIDI note numbers)
CMAJ9 = [48, 55, 59, 62, 64]; FMAJ9 = [41, 48, 52, 55, 57]; G6 = [43, 50, 55, 59, 64]; GSUS = [43, 50, 55, 60, 62]
AM9 = [45, 52, 55, 59, 60]; DM9 = [38, 45, 48, 52, 53]; EM7 = [40, 47, 50, 55, 59]; FMAJ7 = [41, 48, 52, 57]
DMAJ9 = [50, 57, 61, 64, 66]; GMAJ7 = [43, 50, 54, 59, 62]; A6 = [45, 52, 57, 61, 66]; BM7 = [47, 54, 57, 62]
tickhi = lambda s, g, p: clock(s, g, p, True)
ticklo = lambda s, g, p: clock(s, g, p, False)
def clockrun(s0, s1, g=0.035):
    """the clock at 60 beats a minute: a high tick, then a low one"""
    pulse(s0, s1, 60, [(0, tickhi, g, 0.25), (1, ticklo, g * 0.8, 0.2)], fade=2.0)

# 1. A dictionary is never finished: a felt piano over strings, the clock already ticking; the title on the piano
prog('dict', [CMAJ9, FMAJ9, AM9, G6], 0, cq('dict', 'breath'), g=0.05, tone='strings')
motif('dict', [CMAJ9, FMAJ9, AM9, G6], 0, cq('dict', 'breath'), every=1.5, g=0.04, inst=felt)
clockrun(S0('dict') + 0.8, G('dict', 'breath', 0.4))
prog('dict', [CMAJ9], cq('dict', 'breath'), g=0.05, tone='strings', bassg=0.03)
theme(G('dict', 'breath', 0.7), 60, felt, step=0.48, g=0.09); theme(G('dict', 'breath', 0.9), 72, celesta, step=0.48, g=0.03)
# 2. Change arrives: C major, with a question in it; the clock counts the month
prog('arrives', [CMAJ9, FMAJ9, AM9, GSUS], g=0.05, tone='strings')
motif('arrives', [CMAJ9, FMAJ9, AM9, GSUS], every=1.3, g=0.035, inst=felt)
clockrun(S0('arrives'), E('arrives'), 0.03)
# 3. How models go stale: A minor, the strings darker, the clock still going
prog('stale', [AM9, FMAJ7, DM9, EM7], g=0.055, tone='strings', bassg=0.04)
motif('stale', [AM9, FMAJ7, DM9, EM7], every=1.7, g=0.035, inst=felt)
clockrun(S0('stale'), E('stale'), 0.03)
drone(33, G('stale', 'gap', -0.5), 6.0, 0.03, 'strings')
# 4. AI as a watcher: still A minor, glassier; the clock ticks on while the agent reads
prog('watch', [AM9, EM7, FMAJ7, AM9], g=0.05, tone='glass', bassg=0.03)
prog('watch', [AM9, FMAJ7], g=0.025, tone='strings', bassg=0)
motif('watch', [AM9, EM7, FMAJ7, AM9], every=1.4, g=0.03, inst=felt)
clockrun(S0('watch'), E('watch'), 0.03)
# 5. AI as a drafter: moving back towards C, a felt piano figure while the cards are drafted
prog('draft', [FMAJ9, G6, CMAJ9, AM9], g=0.05, tone='strings')
ostinato(G('draft', 'list', -0.4), G('draft', 'cheap', 0.4), [60, 67, 64, 72, 67, 64], 0.36, felt, 0.03, -0.1)
motif('draft', [FMAJ9, G6, CMAJ9, AM9], cq('draft', 'cheap'), every=1.2, g=0.035, inst=felt)
# 6. People decide: C major, warm and resolved, the strings swelling on "people approve"
prog('decide', [CMAJ9, FMAJ9, G6, CMAJ9], g=0.055, tone='strings')
motif('decide', [CMAJ9, FMAJ9, G6, CMAJ9], every=1.3, g=0.04, inst=felt)
pad([48, 55, 60, 64, 67], G('decide', 'rule', 0.8), 5.0, 0.03, 'strings')
# 7. What can go wrong: A minor again, the clock back, uneasy
prog('wrong', [AM9, DM9, EM7, AM9], g=0.055, tone='strings', bassg=0.04)
motif('wrong', [AM9, DM9, EM7, AM9], every=1.6, g=0.035, inst=felt)
clockrun(S0('wrong') + 0.5, G('wrong', 'check', 0.2), 0.028)
# 8. End to end: from F to C, rising as each layer lights; the stamp reads v3 on a full C major chord
prog('e2e', [FMAJ9, G6, AM9, G6], 0, cq('e2e', 'v3'), g=0.05, tone='strings')
prog('e2e', [CMAJ9], cq('e2e', 'v3'), g=0.06, tone='strings', bassg=0.04)
motif('e2e', [FMAJ9, G6, AM9, G6, CMAJ9], every=1.2, g=0.035, inst=felt)
_ot = W('e2e', 'chain', 'one statement')
for i, (m, s_) in enumerate(zip([60, 64, 67, 72, 76, 79, 84], [W('e2e', 'chain', 'one definition', -0.1), _ot - 0.1, _ot + 1.0, _ot + 1.8, W('e2e', 'chain', 'one measure', -0.1), W('e2e', 'chain', 'one test', -0.1), G('e2e', 'agree', 0.2)])):
    felt(m, s_ + 0.2, 0.045, (i - 3) * 0.15)
# 9. What remains: back in C, calm, as the shapes arrive; a felt piano, and no clock (this chapter looks past the month's changes);
# it leans on G at the end, so the pull back's G major arrives as a step home
prog('remains', [CMAJ9, AM9, FMAJ9, G6], 0, cq('remains', 'last'), g=0.05, tone='strings')
prog('remains', [FMAJ9, GSUS], cq('remains', 'last'), g=0.05, tone='strings')
motif('remains', [CMAJ9, AM9, FMAJ9, G6, FMAJ9, GSUS], every=1.5, g=0.03, inst=felt)
# 10. Pull back: the series comes home, in D; the kalimba and the bell answer each other, and the end card rests on D major
prog('end', [GMAJ7, A6, BM7, A6], 0, cq('end', 'breath'), g=0.05, tone='strings')
motif('end', [GMAJ7, A6, BM7, A6], 0, cq('end', 'breath'), every=1.4, g=0.035, inst=kalimba)
prog('end', [DMAJ9], cq('end', 'breath'), g=0.06, tone='warm', bassg=0.04)
pad(DMAJ9, G('end', 'breath', 0.3), 6.0, 0.035, 'strings')
theme(G('end', 'breath', 0.6), 62, kalimba, step=0.5, g=0.09)
def tbell_note(m, s, g, p):
    tbell(m, s, g, p, 3.5)
theme(G('end', 'breath', 0.85), 74, tbell_note, step=0.5, g=0.03)

# effects
# 1. the book opens, the lock closes, then opens, and the letters lift; the OED's revisions in pencil; the count goes to eight; the kilogram
page(G('dict', 'johnson', 2.4), 0.06, -0.2); page(G('dict', 'johnson', 2.8), 0.04, 0.1)
key(W('dict', 'johnson', 'fix'), 0.05); key(G('dict', 'admit', 1.0), 0.05, 0.1); shimmer(G('dict', 'admit', 1.2), 0.03, 1318)
page(W('dict', 'admit', 'The Oxford', -0.4), 0.05, 0.4); [scratch(W('dict', 'admit', 'still', k * 0.4), 0.03, 0.4, 0.4) for k in range(4)]
[woodblock(G('dict', 'planet', -0.2 + k * 0.08), 0.02, 0.3, 900) for k in range(9)]; pop(W('dict', 'planet', 'agreed', -0.2), 0.06, 0.5)
scratch(W('dict', 'planet', 'nine'), 0.05, -0.4, 0.6); pop(W('dict', 'planet', 'eight', -0.2), 0.07, -0.4); chime(W('dict', 'planet', 'eight', 0.1), 0.04, 1175, 0.5)
whoosh(W('dict', 'kilo', 'kilogram', -0.2), 0.8, 0.04, 0.2); chime(W('dict', 'kilo', 'kilogram', 0.5), 0.05, 1568, 0.3)
[pop(W('dict', 'moves', w, -0.1), 0.05, (k - 1) * 0.4) for k, w in enumerate(('an owner', 'a date', 'a version'))]
shimmer(G('dict', 'breath', 0.5), 0.04, 1047)
# 2. three marks on the calendar; a form, a stamp, three dashboards
card(G('arrives', 'gov', -0.3), 0.05, 0.1); pop(G('arrives', 'gov', -0.3), 0.05, -0.5); ping(W('arrives', 'gov', 'new field'), 0.05, 0.1)
card(G('arrives', 'error', -0.3), 0.05, 0.4); pop(G('arrives', 'error', -0.3), 0.05, -0.5); stamp(W('arrives', 'error', 'revoked', 0.2), 0.12, 0.4)
pop(W('arrives', 'rate', 'appears', -0.3), 0.05, -0.5); [card(W('arrives', 'rate', 'three dashboards', -0.2 + k * 0.3), 0.04, (k - 1) * 0.5) for k in range(3)]
[tick(W('arrives', 'rate', 'three different', k * 0.35), 0.06, (k - 1) * 0.5) for k in range(3)]
# 3. four drift marks, each a small glitch; the gap opens with a low tone
[glitch(W('stale', 'kinds', w), 0.05, p) for w, p in (('A value', 0.1), ('A column', 0.3), ('One measure', 0.6), ('A standard', -0.6))]; tone(G('stale', 'gap', 0.2), 0.04, 220)
# 4. the agent notices: a glassy node for each thing it reads, and for each flag
node(W('watch', 'reads', 'An agent', -0.4), 0.05, 0, 1047)
[node(W('watch', 'reads', w), 0.045, p, f) for w, p, f in (('catalog', -0.5, 1319), ('lineage', 0.5, 1568), ('the queries', -0.5, 1760), ('new data', 0.5, 2093))]
node(W('watch', 'compare', 'definition'), 0.045, -0.4, 1319); node(W('watch', 'compare', 'code'), 0.045, 0.4, 1568); glitch(W('watch', 'compare', 'parted', 0.3), 0.05, 0)
[node(W('watch', 'flags', 'each drift', 0.4 + k * 0.45), 0.05, -0.2, 1568 + k * 200) for k in range(3)]; [card(W('watch', 'flags', 'the dashboards', -0.2 + k * 0.3), 0.035, 0.5) for k in range(3)]
[tick(G('watch', 'notice', 0.2 + k * 0.08), 0.03, 0.3) for k in range(12)]
# 5. eight cards drafted into the folder; a stamp: draft; a person's look
link(G('draft', 'drafts', 0.3), 0.04, 0.3); [card(W('draft', 'list', w, 0.5), 0.05, 0.3) for w in ('glossary', 'ontology', 'logical', 'mapping', 'semantic', 'contract', 'tests', 'note')]
stamp(G('draft', 'cheap', 0.3), 0.06, -0.3); shimmer(W('draft', 'cheap', 'Judging'), 0.035, 1175)
# 6. three approvals, stamped; the review; four tests pass; it ships as v3
[stamp(W('decide', 'who', w), 0.1, p) for w, p in (('meaning', -0.5), ('model', 0), ('build', 0.5))]
whoosh(W('decide', 'review', 'same review', -0.6), 1.4, 0.05, -0.3); [chime(W('decide', 'review', 'The tests', 0.5 + k * 0.6), 0.04, 1568 + k * 196, 0.2) for k in range(4)]
seal(W('decide', 'review', 'ships', 0.3), 0.1, 0.4); [pop(W('decide', 'rule', w, -0.5), 0.05, (k - 1) * 0.5) for k, w in enumerate(('recommends', 'approve', 'versioned'))]
# 7. a stamp on the invented definition; a change slipping by; a ghost from old reports; three stops at the gate; our change passes
stamp(W('wrong', 'invent', 'nobody', 0.2), 0.1, -0.3); glitch(W('wrong', 'invent', 'nobody', 0.3), 0.04, -0.3)
whoosh(G('wrong', 'slip', 0.4), 3.4, 0.04, 0.2); whoosh(W('wrong', 'slip', 'And an agent'), 2.2, 0.04, -0.4)
[buzz(G('wrong', 'check', 0.3 + k * 0.3), 0.05) for k in range(3)]; chime(W('wrong', 'check', 'just as', 1.8), 0.05, 1568, 0.5)
# 8. each layer lights (the piano, above); three dashboards change their number; Genie; the old report; v3 is approved
[tick(G('e2e', 'agree', 0.6 + k * 0.2), 0.06, (k - 1) * 0.4) for k in range(3)]; chime(W('e2e', 'agree', 'Genie'), 0.05, 1760, 0.4)
page(G('e2e', 'old', -0.3), 0.05, -0.4); stamp(W('e2e', 'old', 'version two', -0.1), 0.06, -0.4)
seal(W('e2e', 'v3', 'version three'), 0.12); bell(W('e2e', 'v3', 'version three', 0.1), 0.07, 523); [stamp(W('e2e', 'v3', 'version three', 0.6 + k * 0.2), 0.05, 0.5) for k in range(3)]
shimmer(G('e2e', 'breath', 0.3), 0.04, 1047)
# 9. the shapes arrive as they're named, the four answers light in each, the agent drafts, two look-alikes are told apart, the four cards settle
[card(W('remains', 'shapes', w, -0.1), 0.05, (k - 2) * 0.35) for k, w in enumerate(('vaults', 'anchors', 'hooks', 'bridges', 'activity'))]; whoosh(W('remains', 'shapes', 'More'), 0.8, 0.03, 0.7)
[node(W('remains', 'four', w), 0.045, (k - 1.5) * 0.4, f) for k, (w, f) in enumerate((('What a', 1047), ('What makes', 1175), ('What one', 1319), ('when each', 1568)))]
link(W('remains', 'change', 'draft', 0.2), 0.04, 0.2); [card(W('remains', 'change', 'draft', 0.7 + k * 0.5), 0.05, 0.3 + k * 0.3) for k in range(2)]
ping(G('remains', 'alike', 0.6), 0.05, 0); buzz(W('remains', 'alike', 'Only the model', 0.1), 0.04)
[stamp(W('remains', 'last', w, -0.1), 0.05, (k - 1.5) * 0.4) for k, w in enumerate(('meaning', 'identity', 'grain', 'time'))]; shimmer(W('remains', 'last', 'Every new'), 0.035, 1175)
# 10. the triangle, the clay, the two cards, the tools and the job; the end
[node(W('end', 'start', w), 0.045, p, 1175) for w, p in (('a word', -0.5), ('an idea', 0), ('a thing', 0.4))]; [stone(W('end', 'start', 'a mark', k * 0.4), 0.05, 0.5) for k in range(7)]
seal(G('end', 'claim', 0.3), 0.08, -0.4); card(W('end', 'claim', 'So is'), 0.05, 0.4)
[pop(G('end', 'job', 0.1 + k * 0.3), 0.04, (k - 2) * 0.3) for k in range(5)]; scratch(W('end', 'job', 'write'), 0.04, 0, 0.6); stamp(W('end', 'job', 'keep'), 0.08, 0.4)
bell(G('end', 'breath', 0.6), 0.08, 587)
