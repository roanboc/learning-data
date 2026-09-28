# Built to write, built to read: the music and sounds, played by tools/audio.py with the series' instruments (shared/tools/music.py).
# Two voices, in B-flat major. Writing is busy and precise: a marimba ostinato in sixteenths over a woodblock, at 108 beats a minute.
# Reading is slow: string pads and a felt piano, a few notes at a time. Venice in 1494 is a harp over a reed pad, with quill scratches
# and page turns. The anomalies land on a dissonant cluster and a glitch; the star appears on a shimmer and a glassy node.
# The series' four-note motif plays on the marimba at the title and on the felt piano and marimba at the end card.

# chords (MIDI note numbers), in B-flat major
BB9 = [46, 53, 57, 60, 62]; EB9 = [51, 58, 62, 65, 67]; GM9 = [43, 50, 53, 57, 58]; CM7 = [48, 55, 58, 63]; F69 = [41, 48, 53, 55, 57]
DM7 = [50, 57, 60, 65]; BBD = [50, 53, 58, 62, 65]; FSUS = [41, 48, 53, 58, 60]
BPM = 108; SIX = 60 / BPM / 4
# the writing figure: a sixteenth-note arpeggio for each chord, rising and turning back
FIG = {'Bb': [70, 74, 77, 74, 81, 77, 74, 77], 'Eb': [70, 75, 79, 75, 82, 79, 75, 79], 'Gm': [67, 70, 74, 70, 77, 74, 70, 74],
       'F': [69, 72, 77, 72, 81, 77, 72, 77], 'Cm': [67, 70, 75, 70, 79, 75, 70, 75]}


def writing(s0, s1, figs, g=0.032, pan=-0.15, wb=0.028):
    """the writing voice: the marimba's sixteenths, a figure per chord, over a woodblock on the eighths, accented on the beat"""
    d = (s1 - s0) / len(figs)
    for i, f in enumerate(figs):
        a, b = s0 + i * d, s0 + (i + 1) * d
        ostinato(a, b, FIG[f], SIX, marimba, g, pan, fade=1.2 if 0 < i < len(figs) - 1 else 2.0)
    if wb:
        pulse(s0, s1, BPM, [(0, woodblock, wb, pan + 0.3), (0.5, woodblock, wb * 0.45, pan + 0.3), (1, woodblock, wb * 0.7, pan + 0.3), (1.5, woodblock, wb * 0.45, pan + 0.3)], fade=2.0)


def reading(sid, chords, a=None, b=None, g=0.05, every=2.4, fg=0.04):
    """the reading voice: slow string pads, and a felt piano that places a note now and then"""
    prog(sid, chords, a, b, g=g, tone='strings', bassg=0.03)
    motif(sid, chords, a, b, every=every, g=fg, inst=felt)


def cluster(s, g=0.03):
    """something is wrong: three notes a semitone apart, and a glitch"""
    for f, p in ((466.2, -0.3), (493.9, 0.0), (523.3, 0.3)):
        tone(s, g, f)
    glitch(s + 0.05, 0.05)


# 1. Journal and ledger: a harp over a reed pad in Venice; then the two jobs of today, and the title
prog('ledger', [BB9, EB9, GM9, FSUS], 0, cq('ledger', 'today'), g=0.045, tone='reed', bassg=0.035, btone='organ')
motif('ledger', [BB9, EB9, GM9, FSUS], 0, cq('ledger', 'today'), every=1.2, g=0.045, inst=harp)
prog('ledger', [BB9, EB9], cq('ledger', 'today') - 1.0, cq('ledger', 'today') + 8.4, g=0.042, tone='warm', bassg=0.03)
writing(G('ledger', 'today', 3.6), G('ledger', 'today', 8.6), ['Bb', 'Eb'], g=0.03)
reading('ledger', [EB9, BB9], cq('ledger', 'today') + 7.8, None, g=0.045, every=1.8)
theme(G('ledger', 'breath', 0.7), 70, marimba, step=0.44, g=0.07)
harp(82, G('ledger', 'breath', 2.2), 0.035, 0.3)
# 2. Built to write: the writing voice all the way through, over a light pad
prog('write', [BB9, GM9, EB9, F69], g=0.04, tone='warm', bassg=0.03)
writing(S0('write') + 0.4, E('write') - 0.3, ['Bb', 'Gm', 'Eb', 'F'], g=0.032)
# 3. What goes wrong without it: the same figure, darker
prog('wrong', [GM9, CM7, EB9, GM9], g=0.04, tone='warm', bassg=0.035)
writing(S0('wrong') + 0.4, E('wrong') - 0.3, ['Gm', 'Cm', 'Eb', 'Gm'], g=0.027, wb=0.02)
# 4. Another way to write: a lighter figure, then a slow count
prog('docs', [BB9, EB9, DM7, EB9], g=0.04, tone='glass', bassg=0.03)
writing(S0('docs') + 0.4, G('docs', 'trade', 2.6), ['Bb', 'Eb', 'Bb'], g=0.024, pan=0.1, wb=0.016)
# 5. Built to read: the reading voice
reading('read', [EB9, BBD, GM9, EB9, FSUS, BB9], g=0.05, every=2.2)
# 6. Keeping history for reading: the reading voice, calm
reading('history', [BB9, DM7, EB9, GM9, EB9, F69], g=0.048, every=2.6)
# 7. Side by side: both voices at once, writing on the left and reading on the right
prog('side', [BB9, EB9, GM9, BB9], g=0.042, tone='strings', bassg=0.03)
writing(S0('side') + 0.6, E('side') - 0.4, ['Bb', 'Eb', 'Gm', 'Bb'], g=0.026, pan=-0.6, wb=0.018)
motif('side', [BB9, EB9, GM9, BB9], every=1.9, g=0.04, inst=felt)
# 8. Pull back: the reading voice, warm, and the motif at the end card
reading('end', [EB9, BB9, GM9, EB9, FSUS, BB9], g=0.05, every=2.0)
theme(G('end', 'breath', 0.6), 70, felt, step=0.5, g=0.08); theme(G('end', 'breath', 0.62), 58, marimba, step=0.5, g=0.045)

# effects
# 1. the plate, the journal written with a quill, entries posted to the ledger, the balance, a slip and its correction
page(G('ledger', 'venice', 0.4), 0.05, 0.0)
page(G('ledger', 'journal', -0.4), 0.06, -0.4); [scratch(G('ledger', 'journal', 0.4 + k * 1.0), 0.05, -0.5, 0.7) for k in range(4)]
page(G('ledger', 'post', -0.5), 0.06, 0.4)
[scratch(G('ledger', 'post', 0.7 + i * 1.1 + side * 0.18 + 0.75), 0.03, 0.2 + side * 0.3, 0.25) for i in range(4) for side in (0, 1)]
ding(G('ledger', 'two', 0.3), 0.05, 0.4, 1760); buzz(G('ledger', 'two', 4.5), 0.035); scratch(G('ledger', 'two', 6.7), 0.05, 0.4, 0.6); ding(G('ledger', 'two', 7.4), 0.06, 0.4, 2093)
[key(G('ledger', 'today', 3.8 + k * 0.3), 0.035, -0.5 + (k % 5) * 0.1) for k in range(14)]; [tick(G('ledger', 'today', 4.1 + k * 0.6), 0.03, -0.4) for k in range(7)]
shimmer(G('ledger', 'today', 9.6), 0.05, 1397); node(G('ledger', 'today', 9.8), 0.05, 0.5, 1397)
shimmer(G('ledger', 'breath', 0.5), 0.05, 1165)
# 2. rows written, keys, a rule that rejects a row, a transaction that commits and one that rolls back, the names
[key(G('write', 'once', 0.3 + k * 0.4), 0.05, (k % 3 - 1) * 0.4) for k in range(3)]; [key(G('write', 'once', 1.2 + k * 0.25), 0.045, 0.1) for k in range(3)]
[tick(G('write', 'once', 3.6 + k * 0.2), 0.05, -0.2) for k in range(2)]
[tick(G('write', 'keys', 0.4 + k * 0.12), 0.05, (k - 1) * 0.5) for k in range(3)]; card(G('write', 'keys', 2.5), 0.04, 0.0)
key(G('write', 'keys', 4.6), 0.05, 0.2); buzz(G('write', 'keys', 5.6), 0.045)
[key(G('write', 'all', d), 0.05, (k - 1) * 0.5) for k, d in enumerate((2.7, 3.5, 4.4))]; ding(G('write', 'all', 5.7), 0.07, 0.3, 2093)
[key(G('write', 'all', d), 0.045, (k - 1) * 0.5) for k, d in enumerate((6.6, 6.9, 7.3))]; glitch(G('write', 'all', 7.3), 0.045, 0.5); card(G('write', 'all', 7.9), 0.04, -0.3)
[tick(G('write', 'name', d), 0.05, (k - 1.5) * 0.3) for k, d in enumerate((0.5, 1.5, 2.1, 2.8))]
# 3. three copies of a name, two corrected and one missed, a certificate, a deletion, and the fix
[tick(G('wrong', 'three', 2.4 + k * 0.12), 0.04, -0.3) for k in range(3)]
card(G('wrong', 'change', 0.2), 0.04, 0.4); [key(G('wrong', 'change', 1.5 + k * 0.5), 0.05, -0.3) for k in range(2)]; cluster(G('wrong', 'change', 2.7), 0.028)
card(G('wrong', 'print', 0.1), 0.05, 0.5); page(G('wrong', 'print', 0.3), 0.04, 0.5); buzz(G('wrong', 'print', 0.8), 0.03)
card(G('wrong', 'delete', 0.3), 0.04, 0.4); key(G('wrong', 'delete', 2.4), 0.045, -0.3); cluster(G('wrong', 'delete', 3.4), 0.028); glitch(G('wrong', 'delete', 4.2), 0.04, 0.4)
[tick(G('wrong', 'anomaly', d), 0.05, p) for d, p in ((0.5, -0.4), (1.4, 0.4))]; ding(G('wrong', 'anomaly', 3.8), 0.05, -0.3, 1568); ding(G('wrong', 'anomaly', 4.8), 0.05, 0.3, 2093)
# 4. a document written whole, claim and evidence, signed; into a document database and out; checked; a million, counted slowly
card(G('docs', 'doc', 1.2), 0.06, -0.3); [tick(G('docs', 'doc', d), 0.04, -0.3) for d in (5.4, 6.4)]; ding(G('docs', 'doc', 7.8), 0.06, -0.3, 1760)
node(G('docs', 'together', 0.2), 0.04, -0.2, 1175)
card(G('docs', 'shine', 0.2), 0.04, 0.5); page(G('docs', 'shine', 1.6), 0.04, 0.2); page(G('docs', 'shine', 3.4), 0.04, -0.2)
tick(G('docs', 'trade', 1.4), 0.05, -0.3); ding(G('docs', 'trade', 1.5), 0.04, -0.3, 2349)
[tick(G('docs', 'trade', 3.0 + k * 0.32), 0.025, -0.6 + k * 0.05) for k in range(int((E('docs') - G('docs', 'trade', 3.0)) / 0.32) + 1)]
# 5. the question, the fact, its dimensions, the words after "by", the star and its two joins, the answer
card(G('read', 'q', 0.3), 0.04, -0.6)
node(G('read', 'grain', 0.3), 0.05, 0.0, 1175); [tick(G('read', 'grain', 2.2 + k * 0.2), 0.035, -0.2 + k * 0.15) for k in range(4)]
[node(G('read', 'facts', d), 0.045, 0.0, f) for d, f in ((2.0, 1397), (2.8, 1568))]
[node(G('read', 'dims', d), 0.045, p, f) for d, p, f in ((3.0, -0.5, 1175), (3.8, 0.5, 1397), (4.6, -0.5, 1568), (5.3, 0.5, 1760))]
tick(G('read', 'words', 1.8), 0.045, -0.5); [tick(G('read', 'words', 3.4 + k * 0.15), 0.045, -0.5) for k in range(2)]
shimmer(G('read', 'star', 0.2), 0.06, 1397); node(G('read', 'star', 0.3), 0.06, 0.0, 2093); [node(G('read', 'star', 1.2 + k * 0.25), 0.05, p, 1760) for k, p in enumerate((-0.4, 0.4))]
[felt(70 + iv, G('read', 'breath', 0.2 + k * 0.16), 0.035, 0.4) for k, iv in enumerate((0, 4, 7, 11, 14))]
# 6. a year and a move, two awards, a dimension that keeps both rows, a status history, overwrite or keep, the name
node(G('history', 'moved', 2.6), 0.04, 0.0, 1175); [node(G('history', 'moved', 4.0 + k * 0.3), 0.04, -0.3 + k * 0.6, 1568) for k in range(2)]
[key(G('history', 'both', 0.8 + k * 0.8), 0.045, 0.2) for k in range(2)]; [tick(G('history', 'both', 3.6 + k * 2.0), 0.05, (k - 0.5) * 0.8) for k in range(2)]
[card(G('history', 'revoked', 0.6 + k * 0.9), 0.045, (k - 1) * 0.4) for k in range(3)]; buzz(G('history', 'revoked', 1.5), 0.025)
key(G('history', 'choice', 2.4), 0.045, -0.4); key(G('history', 'choice', 4.6), 0.045, 0.4); page(G('history', 'choice', 6.4), 0.05, 0.0)
[scratch(G('history', 'choice', 6.6 + k * 0.45), 0.035, 0.0, 0.45) for k in range(5)]; node(G('history', 'scd', 0.2), 0.05, 0.0, 1397)
# 7. seven joins on the left, two on the right; a name corrected once, and on thousands of rows; each shape at its job
[key(G('side', 'write', 0.2 + k * 0.26 + 0.2), 0.045, -0.6) for k in range(7)]; buzz(G('side', 'write', 2.4), 0.025)
[node(G('side', 'read', 0.5 + k * 0.2), 0.05, 0.6, 1568 + k * 192) for k in range(2)]
key(G('side', 'name', 1.4), 0.05, -0.6); ding(G('side', 'name', 1.8), 0.05, -0.6, 2093)
[key(G('side', 'name', 2.8 + k * 0.3), 0.035, 0.6) for k in range(8)]; [tick(G('side', 'name', 5.2 + k * 0.09), 0.02, 0.6) for k in range(10)]
tick(G('side', 'job', 0.2), 0.05, -0.5); node(G('side', 'job', 0.25), 0.05, 0.5, 1760)
# 8. a pencil sketch, two shapes, three vaults, the confusion struck out, the shapes placed, several shapes ahead
[scratch(G('end', 'one', 0.3 + k * 0.3), 0.035, (k - 1) * 0.3, 0.5) for k in range(3)]; node(G('end', 'one', 1.8), 0.04, -0.5, 1175); node(G('end', 'one', 2.2), 0.04, 0.5, 1568)
[card(G('end', 'medal', 0.5 + k * 0.35), 0.045, (k - 1) * 0.5) for k in range(3)]; glitch(G('end', 'medal', 3.6), 0.035)
node(G('end', 'often', 2.6), 0.045, 0.0, 1397); node(G('end', 'often', 4.6), 0.045, 0.5, 1760); tick(G('end', 'often', 5.6), 0.04)
[node(G('end', 'next', 3.2 + k * 0.4), 0.04, (k - 1) * 0.5, 1568 + k * 200) for k in range(3)]
shimmer(G('end', 'breath', 0.4), 0.05, 1165)
