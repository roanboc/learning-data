# One row of what, and when: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). This film's own palette (the series plan): A minor, turning to A major at "As it was, as it is";
# a slow string pad for the bed; and the series' mark, 1-4-5-8, on a bass clarinet, at the title and the end.
# Two rules, as in film 1:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: the bed is sustained chords that change with the
#    chapters, and each effect is one event.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# Everything stays low and soft, filtered below about 2.5 kHz: muffled knocks (a punch through card), low felt notes (the
# tabulator's dial, a test passing), soft paper (versions stacking), a low double thud (the fan-out), muffled keys, thuds.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- this film's instrument ----
def bassclar(m, start, sec, g=0.05, pan=0.0):
    """a bass clarinet: a hollow tone, odd partials strong and even ones weak, a little breath, darkened, a slow swell in and out"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0025 * np.sin(2 * np.pi * 4.8 * x) * np.minimum(1, x / 0.9)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    s = sum(np.sin(k * ph) * w for k, w in ((1, 1), (2, 0.08), (3, 0.55), (4, 0.06), (5, 0.3), (7, 0.16), (9, 0.08)))
    s = s + 0.03 * filt(noise(sec), 'band', (250, 1100))
    put(norm(filt((s * env(sec, 0.09, min(0.8, sec * 0.45))).astype(np.float32), 'low', 1500)), start, g, pan)
# ---- soft sounds, all low-passed ----
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.04, pan=0.0, f=220):
    """a soft wooden knock, for a card arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * f * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * f * 2.2 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def hole(s, g=0.035, pan=0.0, f=180):
    """the punch going through card: a muffled knock with a breath of torn fibre, very short"""
    x = tt(0.12); X(norm(filt((np.sin(2 * np.pi * f * x) * np.exp(-x * 55) + 0.35 * filt(noise(0.12), 'band', (300, 1500)) * np.exp(-x * 80)).astype(np.float32), 'low', 1600)), s, g, pan)
def tap(s, g=0.02, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.032, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def press(s, g=0.07):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def double(s, g=0.07):
    """the fan-out: a low double thud"""
    thud(s, g); thud(s + 0.2, g * 0.85)
def muted2(s, g=0.035, pan=0.0):
    """a muted double knock, for a test that stops"""
    knock(s, g, pan, 160); knock(s + 0.16, g * 0.8, pan, 150)
def swell(ch, s, sec=3.0, g=0.022):
    """a soft string swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'strings')
def lines(t0, n, per, g=0.018, pan=-0.3):
    """one muffled key per line of code, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g * (1 - 0.25 * (k % 3) / 2), pan)
def mark(start, root, g=0.075):
    """the series' four notes, 1-4-5-8, rising, on the bass clarinet"""
    for i, iv in enumerate([0, 5, 7, 12]):
        bassclar(root + iv, start + i * 0.42, 3.6 if i == 3 else 0.9, g * (1.1 if i == 3 else 1), (i - 1.5) * 0.12)
def bed(sid, chords, a=None, b=None, g=0.038, bassg=0.02):
    """the chapter's chords on a slow string pad, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone='strings', bassg=bassg)

# chords (MIDI note numbers): A minor for the first four chapters, A major from "As it was, as it is"
AM = [45, 52, 57, 60, 64]; AM9 = [45, 52, 59, 60, 64]; FMAJ7 = [41, 48, 52, 57]; DM7 = [38, 45, 50, 53, 57]; ESUS = [40, 47, 52, 57, 59]
CMAJ7 = [36, 43, 47, 52, 55]; GADD9 = [43, 50, 55, 57, 59]; E7 = [40, 47, 50, 56]
AMAJ = [45, 52, 57, 61, 64]; AMAJ9 = [45, 52, 59, 61, 64]; DMAJ7 = [38, 45, 50, 54, 57]; FSM7 = [42, 49, 52, 57]; BM7 = [47, 54, 57, 62]; ESUS4 = [40, 47, 52, 57]

# 1. One card, one day: A minor strings; paper as the calendar is pinned and the schedule laid down; a pencil on each column;
#    a felt note for the cradle; a muffled knock for each hole punched (each a little different); the card on the stack;
#    a low felt note as the dial advances; a swell as the two words lift; the title on the bass clarinet
bed('card', [AM, FMAJ7, DM7, ESUS], 0, cq('card', 'breath'))
paper(W('card', 'day', 'first of June', -0.3), 0.03, -0.5)
paper(G('card', 'day', 0.2), 0.03, 0.0, 0.6)
for i in range(4):
    paper(G('card', 'day', 0.9 + i * 1.15), 0.014 + 0.003 * (i % 2), -0.1 + i * 0.08, 0.9)
knock(W('card', 'day', 'United States', -0.4), 0.025, 0.5)
for i, g in enumerate([0.018, 0.013, 0.016, 0.012, 0.015]):
    paper(W('card', 'born', 'Counting took weeks', i * 0.6 + 0.4), g, -0.6 + i * 0.12, 0.35)
soft(52, W('card', 'born', 'a baby', -0.2), 0.03, -0.5)
paper(W('card', 'born', 'Someone who died'), 0.02, 0.1, 0.7)
knock(G('card', 'punch', 0.1), 0.03, 0.4)
tw_ = W('card', 'punch', 'punched')
for i, (f, g) in enumerate([(180, 0.034), (196, 0.03), (170, 0.036), (205, 0.028), (186, 0.032)]):
    hole(tw_ + 0.1 + i * 0.32 + 0.14, g, 0.35 + (i - 2) * 0.05, f)
tf_ = W('card', 'punch', 'Hollerith', -0.3)
paper(tf_, 0.025, 0.4, 0.6); knock(tf_ + 0.85, 0.03, 0.4)
soft(45, tf_ + 0.9, 0.04, 0.6)
swell([57, 60, 64, 69], G('card', 'bridge', 0.1), 3.0, 0.02)
bed('card', [AM9], cq('card', 'breath'), bassg=0.026)
mark(G('card', 'breath', 0.7), 45)
# 2. One sentence: a knock as Planning's badge arrives; paper for the sentence card, keys as it writes; knocks for the question and
#    the report; a swell as the agent drafts; a felt note for Noor; her approval; keys for the YAML; paper for the convention;
#    a key per row of Aisha's; a felt note as the test passes
bed('grain', [AM, CMAJ7, FMAJ7, GADD9, AM])
knock(W('grain', 'before', 'for Planning', -0.3), 0.03, 0.6)
paper(W('grain', 'before', 'one sentence', -0.2), 0.03, 0.0)
lines(G('grain', 'sentence'), 5, 0.48, 0.016, 0.0)
knock(W('grain', 'name', 'the grain', -0.1), 0.025, 0.0)
knock(W('grain', 'agent', "Planning's question", -0.3), 0.03, -0.4); paper(W('grain', 'agent', 'census report', -0.3), 0.028, -0.4)
swell([57, 60, 64, 67], G('grain', 'agent', -0.2), 2.8, 0.018)
soft(57, W('grain', 'agent', 'Noor', -0.2), 0.03, 0.4)
press(W('grain', 'agent', 'approves it'), 0.06)
paper(G('grain', 'test', -0.3), 0.028, -0.3); lines(G('grain', 'test', -0.2), 6, 0.23, 0.016, -0.3)
paper(W('grain', 'test', 'becomes a test'), 0.025, 0.4)
for i in range(3):
    tap(W('grain', 'test', 'no two rows', i * 0.22), 0.02, 0.4)
soft(64, W('grain', 'test', 'same award', 0.3), 0.032, 0.4)
# 3. Fan-out: a knock as the award arrives; paper as it splits into two versions, and as it settles; a knock for the credit table;
#    keys for the analysis; the low double thud as the rows double; a muted double knock as the grain test stops;
#    the join gains its date; a felt note as the rows fold back to eight; a knock for dbt show's result
bed('fan', [AM, DM7, E7, AM])
knock(W('fan', 'why', 'graduate certificate', -0.3), 0.03, 0.0)
paper(W('fan', 'two', 'two versions', -0.2), 0.03, 0.0, 0.6)
paper(G('fan', 'join', -1.7), 0.018, -0.3, 0.8)
knock(G('fan', 'join', -0.7), 0.028, -0.4)
paper(G('fan', 'join', -0.2), 0.025, 0.4); lines(G('fan', 'join'), 5, 0.28, 0.016, 0.4)
tap(W('fan', 'join', 'every learner', 0.1), 0.02, 0.4)
double(W('fan', 'double', 'become sixteen', 0.3), 0.07)
muted2(W('fan', 'quiet', 'Only the test', 0.1), 0.035, -0.4)
knock(W('fan', 'fix', 'valid on census day', -0.2), 0.03, 0.4)
soft(57, W('fan', 'fix', 'eight rows', 0.2), 0.035, 0.3); soft(64, W('fan', 'fix', 'eight rows', 0.6), 0.028, -0.3)
knock(W('fan', 'fix', 'eight rows', 0.3), 0.025, -0.4)
# 4. Every version kept: three knocks as the sources' stacks arrive, panned by stream; paper for the doc; a felt note for "saw",
#    a higher one for "true"; keys as the dated facts drop in; soft paper as each version stacks onto the staircase;
#    keys for the core's YAML; a felt note as the overlap test passes
bed('versions', [AM, FMAJ7, CMAJ7, ESUS])
for k in range(3):
    knock(G('versions', 'kept', 0.2 + k * 0.35), 0.03, -0.6 + k * 0.15, [220, 200, 240][k])
paper(W('versions', 'kept', 'Nothing is overwritten', -0.3), 0.028, 0.4); lines(W('versions', 'kept', 'Nothing is overwritten'), 6, 0.4, 0.014, 0.4)
soft(52, W('versions', 'seen', 'saw a change'), 0.03, -0.3); soft(59, W('versions', 'seen', 'when it was true'), 0.03, 0.3)
for i in range(6):
    tap(W('versions', 'aisha', 'builds', i * 0.22), 0.016, -0.5 + i * 0.1)
a_, b_, z_ = W('versions', 'aisha', 'Five points'), W('versions', 'aisha', 'forty-five'), W('versions', 'aisha', 'sixty')
for i, s_ in enumerate([a_, b_ - 1.1, b_ - 0.75, b_ - 0.4, b_, z_]):
    paper(s_, 0.022 + 0.004 * (i == 5), -0.5 + i * 0.12, 0.35)
paper(G('versions', 'core', -0.3), 0.026, 0.4); lines(G('versions', 'core'), 6, 0.23, 0.014, 0.4)
soft(57, W('versions', 'core', 'overlap', 0.3), 0.034, -0.2)
# 5. As it was, as it is: the key turns to A major; knocks for the two date pins; a felt note as she counts; paper for the wallet;
#    a knock for the question; one key per faculty's number; a felt note on twelve, another on nine; a swell for "both are right";
#    paper and keys for the macro and the mart; paper for the decision and its approval
bed('was', [AMAJ, DMAJ7, FSM7, AMAJ9, DMAJ7])
knock(W('was', 'census', 'thirty-first'), 0.03, -0.4)
soft(57, W('was', 'census', 'She counts'), 0.034, -0.4)
knock(W('was', 'today', 'about today'), 0.03, 0.5)
paper(W('was', 'today', 'finished in July'), 0.028, 0.5)
tq_ = W('was', 'totals', "Ask Planning's question")
knock(tq_ - 0.3, 0.03, 0.0)
for i in range(4):
    tap(tq_ + 0.9 + i * 0.3, 0.018, -0.1)
    tap(W('was', 'totals', 'Ask it today', 0.3 + i * 0.3), 0.018, 0.2)
soft(57, W('was', 'totals', 'twelve', -0.1), 0.034, -0.1); soft(64, W('was', 'totals', 'nine', -0.1), 0.032, 0.2)
swell([57, 61, 64, 69], G('was', 'both'), 3.2, 0.022)
paper(W('was', 'declare', 'one small macro', -0.3), 0.028, -0.4); lines(W('was', 'declare', 'one small macro'), 6, 0.23, 0.014, -0.4)
paper(W('was', 'declare', 'valid on it', 0.2), 0.024, 0.0); press(W('was', 'declare', 'valid on it', 1.2), 0.055)
# 6. One timeline: knocks as the three systems' stacks arrive; a knock as each band begins, panned by source;
#    keys as the cuts drop; paper as each segment is stitched; a low felt note as the empty segment merges back
bed('stitch', [AMAJ, BM7, DMAJ7, ESUS4])
for k in range(3):
    knock(G('stitch', 'three', 0.3 + k * 0.3), 0.026, 0.5, [220, 200, 240][k])
for lid_word, pan_ in [(('dates', 'platform account'), -0.2), (('dates', 'student record'), -0.4), (('dates', 'short-course'), 0.0)]:
    knock(W('stitch', *lid_word, -0.1), 0.028, pan_)
for i in range(4):
    tap(W('stitch', 'cut', 'every date', i * 0.25 + 0.1), 0.018 - 0.002 * (i % 2), -0.3 + i * 0.2)
for k in range(4):
    paper(W('stitch', 'cut', 'stitches', k * 0.35), 0.018, -0.3 + k * 0.2, 0.4)
lines(G('stitch', 'cut', -0.1), 5, 0.4, 0.014, 0.5)
soft(52, W('stitch', 'same', 'makes no new version'), 0.032, 0.0)
# 7. Late news: a knock for Priya's row; the withdrawal arrives late with a muted knock, off to one side; it lands; knocks for the
#    two counts; a muted double knock for the cross; paper as the card moves to when it took effect; a felt note as Business
#    reaches three; a low bass clarinet note as the 1890 page flickers in; paper for gap 6; accepted, with a stamp
bed('late', [FSM7, DMAJ7, ESUS4, AMAJ])
knock(G('late', 'priya'), 0.028, -0.2)
ta_ = W('late', 'week', 'recorded it', -0.3)
knock(ta_, 0.024, 0.85, 170); knock(ta_ + 0.85, 0.026, 0.3)
paper(W('late', 'week', 'recorded it', 0.2), 0.024, 0.6)
knock(W('late', 'recorded', 'Business would count', -0.2), 0.03, -0.4); knock(W('late', 'recorded', 'census report says', -0.2), 0.03, -0.1)
muted2(W('late', 'recorded', 'census report says', 0.3), 0.03, -0.25)
paper(W('late', 'effect', 'took effect', -0.2), 0.028, -0.2, 0.9)
soft(57, W('late', 'effect', 'took effect', 0.9), 0.034, -0.3)
bassclar(45, W('late', 'effect', 'As in', -0.2), 2.2, 0.03, 0.4)
paper(W('late', 'gap', 'platforms', -0.3), 0.026, 0.4); lines(W('late', 'gap', 'platforms'), 4, 0.5, 0.014, 0.4)
press(W('late', 'gap', 'accepted'), 0.05)
# 8. A promise to write: a swell as the core settles; a knock for each consumer's card; a felt note as steps 4 and 5 light;
#    the end on the bass clarinet, over A major
bed('next', [AMAJ, DMAJ7], 0, cq('next', 'breath'))
swell([57, 61, 64, 68], G('next', 'what', -0.6), 3.0, 0.02)
knock(G('next', 'what', 0.4), 0.028, -0.4); knock(G('next', 'what', 0.8), 0.028, 0.4)
soft(61, W('next', 'promise', 'write down'), 0.032, 0.0)
pad([45, 52, 57, 61, 64, 68], G('next', 'breath'), 6.0, 0.04, 'strings'); drone(33, G('next', 'breath'), 6.0, 0.026, 'strings')
mark(G('next', 'breath', 0.8), 45, 0.08)
