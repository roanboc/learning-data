# Workloads without secrets: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette this film reserved in the module's list (/mnt/project-files/data-protection/palettes.md, 5 November 2026), in no other
# score: jaw harps as Johann Heinrich Scheibler set them in his aura (Krefeld, 1816), and a trombone, soft and low; both made here.
#  - The aura is many small jaw harps, each a steel tongue in an iron frame tuned to its own note, held to the lips one at a time, so a
#    tune moves from note to note instead of over one note's overtones. Each is plucked softly, one at a time, never strummed, the
#    mouth held round so only the low overtones sound: a short, hollow, metallic hum that fades in about a second. It plays the
#    opening's streets, and after it a note where something appears: the problem's note, G, low and round, for each secret someone
#    holds as its card appears (Jun's token, each of its copies, people's own tokens, the one password left), and none for what nobody
#    holds (a pass, a managed identity's credentials, a token once it's ended).
#  - The mark, a question and an answer, as the car asks the key's chip: two plucks that ask (F, then B-flat as the mouth opens), then
#    two that answer (D, then B-flat below as it closes, on the home note). The opening plays it as the car asks the chip; a wire or a
#    copy gets the question and no answer; "Asked, not stored" plays it as the platform asks each run, and the copy gets the question
#    alone again; the close plays it as the job proves who it is. Three times in all, as quiet.py allows a figure four.
#  - The trombone is the people: the owner at dawn, then Jun, whose token ends, and Sam, who owns registrar-loader. One voice, plain,
#    no vibrato, never sliding (a new note is tongued, after a breath); held only under the opening, at a few chapter turns and at the
#    end.
#  - Keys, all tuned pure (just intonation from B-flat, see hz()): B-flat major and its chords that are pure here (B-flat, E-flat and
#    F major, G and D minor; C minor isn't, so C never sounds with E-flat or G), G minor for the problem.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story (film.json's "story": the street and the car asking its key), and after it
#    only at a chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice.
#  - Nothing trembles or pulses (no tremolo, no vibrato, no slides); film.json lists no urgent chapter, so nothing pulses at all.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a page or a card laid down (paper), a soft knock as a pill or a tag
#    lands, a tap as a tick or a switch lights, a click as a key turns, a breath of air as a line is drawn, a door lights or something
#    slides, the stamp as a token is ended, and a soft thud as a push meets the wall. No car horn, alarm or beep, and nothing Dutch.
# And everything stays low and soft, below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1816)  # this film's own randomness: the room

# ---- tuning: just intonation from B-flat, so the notes of a chord are whole-number ratios of each other and nothing beats. B-flat
# major (B-flat D F), E-flat major (E-flat G B-flat), F major (F A C), G minor (G B-flat D) and D minor (D F A) are pure here; C minor
# (C E-flat G) isn't, so the score never lets C ring with E-flat or G
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (58, 233.082)  # B-flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Bb2, D3, F3, G3, A3, Bb3, C4, D4, Eb4, F4, G4, Bb4 = 46, 50, 53, 55, 57, 58, 60, 62, 63, 65, 67, 70

# ---- the levels: the aura about as far under the voice as the module's other music (matched by loudness, not by peak), the trombone
# a little under it, as it holds; the effects about 12 dB under the music (FX scales them all)
JL, BL, FX = 0.07, 0.05, 1.4

# a small room round the players, ringing on for about a second, and nothing much above 1.5 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one, so `room` is its share), and a held note is set back to the level it had
# before the room (_held), so the room colours a note but never moves it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a held note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b
    seconds, once it has come in and before it lets go). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the aura's jaw harps. The tongue swings through its frame, so its sound is a full row of whole-number partials (nothing beats
# with the next harp's), falling a little faster than 1/k; the mouth, held round, is one soft resonance over the low partials, so only
# they sound. Each partial fades a little faster than the one below it, the whole note in about a second, at one pitch and one level.
# MOUTH: where the mouth rings, round as it closes and a little higher as it opens (the mark's asking pluck), held still while a note
# sounds, so nothing wavers
MOUTH = {'round': 360.0, 'mid': 520.0, 'open': 720.0}
def _jawtone(f, x, mouth):
    F = MOUTH[mouth]; s = np.zeros(len(x))
    for k in range(1, int(2300 // f) + 1):
        fk = f * k
        a = k ** -0.9 * (0.3 + 1.6 * np.exp(-((fk - F) / (0.45 * F)) ** 2))
        s += a * np.exp(-x / (0.46 / (1 + 0.28 * (k - 1)))) * np.sin(2 * np.pi * fk * x + 0.6 * k)
    return s

def jaw(m, t0, g=1.0, pan=0.0, mouth='round', room=0.22, sec=1.4):
    """one harp of the aura, plucked softly at t0: m its note, mouth how the lips hold it"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    s = _jawtone(hz(m), x, mouth) * np.minimum(1, x / 0.005) * np.cos(0.5 * np.pi * np.clip((x - (sec - 0.3)) / 0.3, 0, 1)) ** 2
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2200)
    put(_room(s, room).astype(np.float32), t0, g * JL, pan)

def tune(notes, t0, step, g=0.9, pan=0.0):
    """a slow line on the aura: (note, mouth) one after another, step seconds apart, each harp let ring as the next is taken up"""
    for i, (m, mouth) in enumerate(notes):
        jaw(m, t0 + i * step, g, pan, mouth)
    return t0 + len(notes) * step

def mark(t0, g=0.9, pan=0.0, answer=True):
    """the question and the answer: F, then B-flat as the mouth opens (the car asks); D, then B-flat below as the mouth closes, on the
    home note (the chip answers). answer=False: the question alone, as a wire or a copy gets it"""
    jaw(F4, t0, g, pan, 'round'); jaw(Bb4, t0 + 0.42, g * 0.92, pan, 'open')
    if answer:
        jaw(D4, t0 + 0.78, g * 0.95, pan, 'mid'); jaw(Bb3, t0 + 1.22, g, pan, 'round')

# ---- the trombone, soft and low: a brass tone's partials, whole multiples (nothing beats), strongest near 500 Hz where the bore and
# the bell lift them, rolled off above about 900 Hz as a soft note is. Each partial speaks a moment after the one below (a brass note
# blooms), then the note holds one level and one pitch, with no vibrato, and stops; it never slides to the next
def _bone(f, x, sec, att, rel):
    s = np.zeros(len(x))
    for k in range(1, int(1800 // f) + 1):
        fk = f * k; ak = att * (1 + 0.35 * (k - 1))
        a = k ** -1.1 * (1 + 0.9 * np.exp(-((fk - 500) / 280) ** 2)) / (1 + (fk / 900) ** 2)
        e = np.where(x < sec, np.sin(0.5 * np.pi * np.minimum(x / ak, 1)) ** 2,
                     np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2 * (x < sec + rel))
        s += a * e * np.sin(2 * np.pi * fk * x + 0.4 * k)
    return s

def bone(m, a, b, g=1.0, pan=0.0, att=0.16, rel=0.35, room=0.3):
    """the trombone: one note held from a to b"""
    sec = max(0.5, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR
    s = filt((lambda v: v / max(1e-9, float(np.abs(v).max())))(_bone(hz(m), x, sec, att, rel)).astype(np.float32), 'low', 1600)
    put(_held(s, room, min(sec, att * 3), sec).astype(np.float32), a, g * BL, pan)

# ---- soft sounds, all low-passed
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a pill or a tag landing"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, a light click: a tick or a switch lighting"""
    s_tap(s, g * FX, pan)
def click(s, g=0.012, pan=0.0):
    """a key turning in the ignition: a short, dull click, low"""
    s_knock(s, g * FX, pan, 330)
def paper(s, g=0.013, pan=0.0, sec=0.45):
    """a page or a card laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=1.0, g=0.008, pan=0.0, lo=140, hi=900):
    """something passing: a line drawn, a door lighting, a card sliding: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def thud(s, g=0.018, pan=0.0):
    """a push meeting the wall: a low, soft thud"""
    s_knock(s, g * FX, pan, 82)
def stamp(s, g=0.016, pan=0.0):
    """the stamp landing on a token: a soft knock, a little lower, and the card under it"""
    s_knock(s, g * FX, pan, 170); paper(s + 0.01, g * 0.45, pan, 0.18)

# =============================================================================================================================
# 1. A key anyone could copy: the Netherlands, the middle of the 1990s. The street at night: the trombone low under it (the people who
#    park there), and the aura's tune over it, note by note, in B-flat major, turning to G minor as "stolen" is said. Inside a car: the
#    key turns (a click) and only closes a switch (a tap as the circuit lights); a wire closes it too, and so does a copy (the problem's
#    notes, low). The next morning: the owner by the empty space, the trombone held under her, the aura falling in G minor as each
#    harm lands (a knock for each); "Something has to change": F major, the turn
c0 = S0('copy')
bone(Bb2, c0 + 0.8, W('copy', 'streets', 'every street', 0.2), 0.75)
tune([(Bb3, 'round'), (D4, 'round'), (F4, 'mid'), (G4, 'mid'), (F4, 'round')], c0 + 1.0, 1.05, 0.85, -0.05)
tune([(D4, 'round'), (Eb4, 'mid'), (D4, 'round')], G('copy', 'streets', 0.6), 1.1, 0.8, 0.05)
P_stolen = W('copy', 'streets', 'stolen')
knock(W('copy', 'streets', 'every year'), 0.012, px(960), 260)
jaw(G3, P_stolen + 0.15, 0.85, 0.0)
click(W('copy', 'switch', 'turns', 0.6), 0.011, px(1150))
tap(W('copy', 'switch', 'switch'), 0.009, px(1300))
jaw(Bb3, W('copy', 'switch', 'switch', 0.4), 0.6, 0.1)
air(W('copy', 'wire', 'A wire', -0.2), 0.7, 0.006, px(1000), 160, 800)
knock(W('copy', 'wire', 'close', 0.2), 0.011, px(1100), 200)
jaw(D3, W('copy', 'wire', 'close', 0.3), 0.8, 0.05)
click(W('copy', 'wire', 'copy of', 1.3), 0.011, px(1150))
jaw(G3, W('copy', 'wire', 'copy of', 1.35), 0.75, 0.05)
P_own = W('copy', 'owner', 'For the owner')
bone(D3, P_own - 0.4, W('copy', 'owner', 'a car that may', 1.4), 0.8, px(1330))
jaw(D4, P_own + 0.2, 0.7, -0.1)
for word, m in (('no way to work', Bb3), ('a claim', A3), ('a car that may', G3)):
    knock(W('copy', 'owner', word), 0.01, px(925), 260)
    jaw(m, W('copy', 'owner', word, 0.25), 0.7, -0.05)
P_chg = W('copy', 'change', 'Something')
tune([(F4, 'open'), (A3, 'mid'), (C4, 'round')], P_chg + 0.5, 1.0, 0.7, 0.0)

# 2. The car asks the key. The same morning: the European Union's rule, a card laid down, the trombone holding for the owners, and the
#    aura rising in B-flat. The new key: its chip (a tap); the key turns (a click), and the car asks the chip for its code: the mark,
#    question and answer, and the circuit lights green. No answer, no engine (a knock). A wire gets nothing (a knock as it's crossed
#    out); a copy turned in the lock gets the question and no answer, and is crossed out too. Mornings later: the two bars drawn up,
#    a note as each reaches its height; theft down and the cost (a knock each); her car back where she left it: the trombone again,
#    and the aura in B-flat. For data: the job's badge laid down, the door lighting; at the university, Jun's token: the problem's note.
#    The three tools (a tap each). The title card: the trombone low, and the aura falling home
a0 = S0('asks')
P_eu = W('asks', 'eu', 'European Union')
paper(P_eu - 0.2, 0.013, px(470), 0.6)
bone(Bb2, a0 + 0.4, W('asks', 'eu', 'every new car', 0.6), 0.7, px(1330))
tune([(Bb3, 'round'), (D4, 'round'), (F4, 'mid')], P_eu + 0.2, 1.1, 0.75, -0.05)
jaw(Bb4, W('asks', 'eu', 'electronic', 0.3), 0.65, 0.0, 'mid')
tap(W('asks', 'chip', 'small chip'), 0.009, px(1230))
click(W('asks', 'radio', 'turns', 0.6), 0.011, px(1150))
mark(W('asks', 'radio', 'asks', -0.05), 0.95, px(1180))
knock(W('asks', 'run', "won't run", -0.3), 0.011, px(1640), 250)
air(W('asks', 'nowire', 'A wire', 0.3), 0.7, 0.006, px(1000), 160, 800)
knock(W('asks', 'nowire', 'A wire', 0.9), 0.01, px(1640), 210)
P_shape = W('asks', 'nowire', 'a key cut')
click(P_shape + 1.4, 0.011, px(1150))
mark(P_shape + 1.35, 0.85, px(1180), answer=False)
knock(P_shape + 2.6, 0.01, px(1640), 210)
air(W('asks', 'fifth', 'one in five', -0.3), 0.9, 0.006, px(300), 160, 800)
jaw(D4, W('asks', 'fifth', 'one in five', 0.6), 0.7, px(300))
air(W('asks', 'fifth', 'all of them', -0.2), 1.1, 0.006, px(560), 160, 800)
jaw(Bb4, W('asks', 'fifth', 'all of them', 0.9), 0.7, px(560), 'mid')
knock(W('asks', 'forty', 'forty percent'), 0.012, px(300), 260)
knock(W('asks', 'forty', 'fifty euros'), 0.009, px(260), 280)
P_few = W('asks', 'fewer', 'Far fewer')
bone(F3, P_few - 0.1, P_few + 3.4, 0.75, px(1330))
tune([(Bb3, 'round'), (D4, 'round'), (F4, 'mid')], P_few + 0.5, 1.0, 0.72, px(1100))
P_prv = W('asks', 'data', 'proves')
paper(P_prv - 0.4, 0.012, px(940))
air(P_prv + 0.6, 1.0, 0.006, px(1590), 160, 900)
jaw(F4, P_prv + 0.7, 0.6, px(1590), 'mid')
jaw(G3, W('asks', 'still', 'a copy', -0.1), 0.8, px(940))
for word, x_ in (('Microsoft Entra ID', 700), ('Azure Databricks', 1030), ('GitHub', 1330)):
    tap(W('asks', 'builds', word, -0.1), 0.008, px(x_))
P_ttl = G('asks', 'breath')
bone(Bb2, P_ttl + 0.2, E('asks') - 0.2, 0.7, 0.0)
tune([(F4, 'mid'), (D4, 'round'), (Bb3, 'round')], P_ttl + 0.4, 1.05, 0.72, 0.0)

# 3. A key with no end. The hall at night: the job's badge laid down, the records drawn in as a line of light, its own name (a knock).
#    "But": Jun Park, and his token: the trombone (the chapter's turn) and the problem's note as the token appears; the line to the door
#    drawn; everything Jun may do (a knock). Each copy: the same note again as its pane comes in, for each works as well as the first.
#    What could happen (a knock each). The car's lock: a copy turned (a click), and it starts (a knock). The ladder: the job on its
#    lowest rung (the problem's note), then the way up, a harp for each rung as the line climbs (no C, which would beat with G)
n0 = S0('noend')
paper(W('noend', 'two', 'a job', -0.3), 0.012, px(400))
air(W('noend', 'two', 'loads', -0.2), 1.6, 0.006, px(900), 160, 800)
knock(W('noend', 'named', 'registrar loader', -0.3), 0.01, px(900), 270)
P_jun = W('noend', 'token', 'Jun Park')
bone(D3, P_jun - 0.2, P_jun + 2.4, 0.75, px(230))
jaw(G3, P_jun + 0.1, 0.85, px(750))
air(W('noend', 'holds', 'whoever holds'), 0.8, 0.006, px(1280), 160, 900)
knock(W('noend', 'holds', 'everything', -0.2), 0.011, px(1590), 250)
for word, x_ in (("the job's settings", 585), ('a notebook', 915), ("Jun's laptop", 1245)):
    jaw(G3, W('noend', 'copies', word, -0.15), 0.72, px(x_))
knock(W('noend', 'moves', 'If Jun moved', -0.2), 0.01, px(1100), 250)
knock(W('noend', 'moves', 'If someone', -0.2), 0.01, px(1100), 250)
P_st = W('noend', 'car', 'starts for anyone')
click(P_st + 0.2, 0.011, px(1000))
knock(P_st + 0.5, 0.01, px(1000), 200)
jaw(G3, W('noend', 'ladder', 'No secret to lose', 0.4), 0.7, px(300))
P_up = W('noend', 'ladder', 'the way up')
for k, m in enumerate((Bb3, D4, Eb4, F4, G4, Bb4)):
    jaw(m, P_up + 1.4 * k / 5, 0.62 + 0.03 * k, px(900) - 0.05 + 0.02 * k, 'round' if k < 5 else 'mid')

# 4. A name of its own. Microsoft Entra ID's page laid down, and the aura at the chapter's turn: B-flat, then F as its kind, a service
#    principal, appears; a workload, not a person (a knock). The platform's page, and the line it reads by. The chain its rights come
#    by, drawn link by link, and the catalog it owns (a knock). Sam sets the job to run as registrar-loader: the trombone, and D as the
#    new name appears; Jun's token slides out, and "No token" (a knock). The badge, and the door lit for it: D, then F. The runs page:
#    the first run under its own name, its tick, and the home note. Nothing breaks (a knock)
paper(W('name', 'entra', 'Microsoft Entra ID', -0.3), 0.013, px(390))
jaw(Bb3, W('name', 'entra', 'Microsoft Entra ID'), 0.66, px(390))
jaw(F4, W('name', 'entra', 'service principal', -0.1), 0.62, px(390), 'mid')
knock(W('name', 'entra', 'an identity for a workload'), 0.01, px(280), 260)
paper(W('name', 'reads', 'reads both', -0.3), 0.012, px(1100))
air(W('name', 'reads', 'reads both'), 0.8, 0.006, px(760), 160, 900)
paper(W('name', 'rights', 'its rights', -0.2), 0.01, px(300))
air(W('name', 'rights', 'from a group', -0.2), 1.2, 0.006, px(700), 160, 900)
knock(W('name', 'rights', 'from a group', 0.6), 0.009, px(1150), 280)
knock(W('name', 'rights', 'Who is it', -0.2), 0.009, px(300), 280)
paper(W('name', 'runas', 'Sam sets', -0.2), 0.012, px(540))
P_ra = W('name', 'runas', 'run as registrar loader')
bone(F3, P_ra - 0.1, P_ra + 2.4, 0.72, px(1190))
jaw(D4, P_ra + 0.4, 0.62, px(400), 'mid')
air(W('name', 'runas', "takes Jun's token", 0.3), 1.2, 0.006, px(420), 160, 900)
knock(W('name', 'runas', "takes Jun's token", 1.4), 0.01, px(250), 260)
paper(W('name', 'vouches', 'knows which job', -0.2), 0.012, px(600))
P_gv = W('name', 'vouches', 'gives each run')
air(P_gv, 1.0, 0.006, px(1590), 160, 900)
jaw(D4, P_gv + 0.05, 0.62, px(1300)); jaw(F4, P_gv + 0.5, 0.6, px(1450), 'mid')
knock(W('name', 'vouches', 'nothing anyone keeps'), 0.01, px(450), 260)
paper(W('name', 'night', 'On Tuesday', -0.2), 0.012, px(640))
jaw(Bb3, W('name', 'night', 'for the first time', 0.1), 0.66, px(1100))
knock(W('name', 'breaks', 'nothing breaks', -0.2), 0.01, px(400), 260)

# 5. Asked, not stored. GitHub's page laid down; Jun's laptop and his token: the problem's note, and the dashed line to the door. The
#    workflow, no token kept (a knock). The note GitHub signs: laid down, and as its seal closes, B-flat then F. The policy page; its
#    lines lit (a tap each), linked to the note; "Nothing else" (a knock). They match: the ticks, and D, F, then B-flat as the pass
#    appears; it slides in at the door. From anywhere else: the note laid down, its line drawn, and the problem's note as it's crossed
#    out. Good for minutes; nothing stored (a knock each). Microsoft Entra ID's page, its ticks. The car's lock, asking its key: the key
#    turns (a click), the mark, question and answer; then a copy: the question alone. Where approvals live (a knock)
paper(S0('asked') + 0.5, 0.012, px(470))
jaw(G3, W('asked', 'code', 'until now'), 0.72, px(1160))
air(W('asked', 'code', 'with his token'), 0.9, 0.006, px(1360), 160, 800)
paper(W('asked', 'actions', 'GitHub Actions', -0.2), 0.011, px(470))
knock(W('asked', 'actions', 'keeps no token'), 0.01, px(1000), 260)
paper(W('asked', 'note', 'For every run', -0.1), 0.012, px(410))
P_sig = W('asked', 'note', 'signs')
jaw(Bb3, P_sig + 0.95, 0.64, px(670)); jaw(F4, P_sig + 1.4, 0.6, px(670), 'mid')
paper(W('asked', 'checks', 'one thing more', -0.3), 0.012, px(1090))
tap(W('asked', 'once', "the platform's repository", -0.2), 0.008, px(1090))
tap(W('asked', 'once', 'production environment', -0.2), 0.008, px(1090))
air(W('asked', 'checks', 'exactly'), 0.9, 0.006, px(770), 160, 900)
knock(W('asked', 'once', 'nothing else'), 0.01, px(900), 260)
P_mt = W('asked', 'pass', 'When they match')
jaw(D4, P_mt + 0.15, 0.62, px(1350)); jaw(F4, P_mt + 0.6, 0.6, px(1350), 'mid')
jaw(Bb4, W('asked', 'pass', 'gives the run a pass', -0.1), 0.6, px(1060), 'mid')
P_hr = W('asked', 'pass', 'good for an hour')
air(P_hr + 0.9, 1.3, 0.007, px(1300), 160, 900)
paper(W('asked', 'elsewhere', 'Run from anywhere else', -0.2), 0.011, px(410))
air(W('asked', 'elsewhere', 'says where'), 0.7, 0.006, px(765), 160, 800)
jaw(G3, W('asked', 'elsewhere', 'no pass', -0.1), 0.72, px(1090))
knock(W('asked', 'minutes', 'good for minutes', -0.1), 0.009, px(300), 280)
knock(W('asked', 'minutes', 'nothing is stored'), 0.01, px(300), 260)
paper(W('asked', 'azure', 'Microsoft Entra ID', -0.3), 0.012, px(1090))
tap(W('asked', 'azure', 'the same note'), 0.009, px(1350))
P_ak = W('asked', 'like', 'asks each run')
click(W('asked', 'like', 'Like the car', 1.0), 0.011, px(1090))
mark(P_ak - 0.15, 0.9, px(1090))
mark(W('asked', 'like', 'a copy', 0.2), 0.8, px(1090), answer=False)
knock(W('asked', 'review', 'From a branch', -0.3), 0.009, px(400), 280)

# 6. No keys to keep. Azure's page for the catalog's access connector: an identity of its own, switched on, and B-flat then F; its
#    credentials, kept and changed by Azure (a card laid down, and no note: nobody holds them), seen by nobody (a knock); the line to
#    the registrar's files, the only identity that may read them (a knock). People's own tokens in their Git folders: the problem's note;
#    Jun's, with no end (a knock); then the Databricks GitHub app in each row: D, then home; its page; a pass for each person (a tap).
#    The rule for every tool in GitHub: F, D and home, slowly
paper(W('nokeys', 'azure', 'a resource', -0.3), 0.012, px(500))
P_mi = W('nokeys', 'azure', 'a managed identity')
tap(P_mi, 0.009, px(160))
jaw(Bb3, P_mi + 0.25, 0.62, px(300)); jaw(F4, P_mi + 0.7, 0.6, px(300), 'mid')
paper(W('nokeys', 'sees', 'looks after', -0.2), 0.011, px(440))
knock(W('nokeys', 'sees', 'nobody ever sees'), 0.01, px(230), 260)
air(W('nokeys', 'connector', "the registrar's files"), 0.6, 0.006, px(950), 160, 900)
knock(W('nokeys', 'connector', 'the only identity', 0.2), 0.01, px(1200), 260)
paper(W('nokeys', 'git', 'on the platform', -0.2), 0.012, px(540))
jaw(G3, W('nokeys', 'git', 'personal tokens', -0.2), 0.72, px(600))
knock(W('nokeys', 'juns', 'every repository', -0.3), 0.01, px(500), 250)
P_app = W('nokeys', 'app', 'Databricks GitHub app')
jaw(D4, P_app + 0.4, 0.62, px(600), 'mid'); jaw(Bb3, P_app + 0.85, 0.64, px(600))
paper(W('nokeys', 'app', 'repository alone', -0.6), 0.011, px(1215))
tap(W('nokeys', 'hours', 'each person', -0.2), 0.008, px(500))
P_rule = W('nokeys', 'rule', 'When a tool')
paper(P_rule - 0.2, 0.012, px(800))
tune([(F4, 'mid'), (D4, 'round'), (Bb3, 'round')], P_rule + 0.1, 1.0, 0.62, px(800))

# 7. One password, one vault. The student system's door, its lock (a knock), the records drawn from it; no other way in, yet (a knock).
#    The key vault's page, and its one sealed password: the problem's note, the one secret left. The secret scope, the line to the vault
#    drawn, its tick. A notebook that prints it (a tap) and sees only the word redacted (a knock, muffled). The function: its page, its
#    identity switched on, the lines it changes it by, its tick, and "Changed": F, then D. The exception written down. The ladder: up
#    three rungs to the vault's, and stopping there; then the top rung lit, where it should climb
knock(W('vault', 'door', 'still wants a password'), 0.009, px(260), 220)
air(W('vault', 'door', 'come from', -0.2), 1.2, 0.006, px(700), 160, 800)
knock(W('vault', 'yet', 'no other way', -0.1), 0.01, px(600), 250)
P_kv = W('vault', 'kv', 'a key vault')
paper(P_kv - 0.3, 0.012, px(950))
jaw(G3, P_kv, 0.75, px(860))
paper(W('vault', 'scope', 'secret scope', -0.3), 0.011, px(950))
air(W('vault', 'scope', 'secret scope'), 0.5, 0.005, px(950), 160, 900)
tap(W('vault', 'scope', 'only registrar loader'), 0.009, px(572))
tap(W('vault', 'redacted', 'prints it'), 0.008, px(700))
knock(W('vault', 'redacted', 'the word redacted', -0.2), 0.009, px(650), 200)
paper(W('vault', 'month', 'a small function', -0.3), 0.011, px(950))
tap(W('vault', 'month', 'its own managed identity'), 0.008, px(560))
air(W('vault', 'month', 'at the student system'), 0.7, 0.006, px(460), 160, 900)
P_inv = W('vault', 'month', 'in the vault')
air(P_inv, 0.5, 0.005, px(1300), 160, 900)
jaw(F4, P_inv + 0.1, 0.6, px(1196), 'mid'); jaw(D4, P_inv + 0.55, 0.6, px(1196))
paper(W('vault', 'written', 'written down', -0.3), 0.012, px(950))
P_low = W('vault', 'rung', 'a lower rung')
for k, m in enumerate((Bb3, C4, D4)):
    jaw(m, P_low - 0.2 - 0.84 + 0.42 * k, 0.6 + 0.03 * k, px(900), 'round')
jaw(Bb4, W('vault', 'rung', 'until the student system'), 0.58, px(900), 'mid')

# 8. Copies in the code. The copies already made: the problem's note, once, for both. GitHub's settings: the page, and Secret
#    Protection switched on (a tap). The history read back to the first commit: one breath of air as the scan crosses it. The token
#    found: the problem's note as the ring lights; "It does": still works, the low D. That morning Jun ends it: the trombone (the
#    chapter's turn) under the stamp, and no note, as the secret is gone. The copies open nothing: the alert's card stamped too; closed
#    as revoked (a knock). Still in the history, opening nothing (a knock). Push protection: the push slides to the wall, a thud as it
#    stops; a bypass gives a reason (a card). That afternoon, personal tokens switched off (a tap). Then, without words, the job at the
#    door: B-flat, D, F, slowly
f0 = S0('found')
jaw(G3, f0 + 0.5, 0.7, px(730))
paper(W('found', 'on', 'On Tuesday', -0.1), 0.012, px(540))
tap(W('found', 'on', 'GitHub Secret Protection', 0.5), 0.009, px(160))
paper(W('found', 'reads', 'the whole history', -0.4), 0.011, px(540))
air(W('found', 'reads', 'the whole history'), 4.2, 0.006, px(540), 120, 700)
jaw(G3, W('found', 'finds', "Jun's token", 0.1), 0.75, px(500))
P_does = W('found', 'does', 'It does')
knock(P_does - 0.1, 0.011, px(250), 230)
jaw(D3, P_does, 0.78, px(250))
paper(W('found', 'weeks', 'two weeks', -0.1), 0.011, px(540))
P_end = W('found', 'weeks', 'Jun ends it')
bone(Bb2, P_end - 0.2, P_end + 2.2, 0.72, px(1190))
stamp(P_end + 0.3, 0.016, px(850))
stamp(W('found', 'nothing', 'open nothing', 0.3), 0.013, px(980))
knock(W('found', 'nothing', 'revoked', -0.2), 0.01, px(560), 260)
knock(W('found', 'history', 'opens nothing', -0.2), 0.009, px(800), 280)
paper(W('found', 'push', 'push protection', -0.1), 0.011, px(290))
P_stp = W('found', 'push', 'stops a push')
air(P_stp - 0.6, 1.5, 0.007, px(500), 140, 800)
thud(P_stp + 1.0, 0.017, px(880))
knock(W('found', 'push', 'before it lands', -0.2), 0.009, px(1100), 260)
paper(W('found', 'bypass', 'pushes past it', -0.2), 0.011, px(1160))
paper(W('found', 'afternoon', 'That afternoon', -0.3), 0.011, px(590))
tap(W('found', 'afternoon', 'switched off'), 0.009, px(160))
knock(W('found', 'afternoon', 'People and groups', -0.2), 0.009, px(300), 280)
P_fb = G('found', 'breath')
air(P_fb - 0.1, 1.2, 0.006, px(1500), 160, 900)
tune([(Bb3, 'round'), (D4, 'round'), (F4, 'mid')], P_fb + 0.2, 0.95, 0.66, px(900))

# 9. Nothing to copy. Back to the street at night: the opening's tune again, slower and shorter; a wire starts nothing, far fewer cars
#    stolen (a knock each). The hall: the badge laid down, and the job proving who it is: the mark, question and answer, as the door
#    lights. Nothing anyone could copy (a knock). The one password left: the problem's note, once more; a pushed secret stopped (a
#    knock). The end card: the trombone low, B-flat, held to the end, and the aura's last answer, D, then home
e0 = S0('close')
tune([(Bb3, 'round'), (D4, 'round'), (F4, 'mid'), (D4, 'round')], e0 + 0.5, 1.3, 0.7, 0.0)
knock(W('close', 'dutch', 'a wire started nothing'), 0.01, px(960), 260)
knock(W('close', 'dutch', 'far fewer'), 0.01, px(960), 260)
paper(W('close', 'now', 'At the university', -0.4), 0.012, px(940))
P_pv = W('close', 'now', 'proves who it is')
air(P_pv, 1.0, 0.006, px(1590), 160, 900)
mark(P_pv - 0.05, 0.85, px(1200))
knock(W('close', 'now', 'nothing anyone'), 0.01, px(900), 260)
jaw(G3, W('close', 'one', 'One password'), 0.66, px(410))
knock(W('close', 'one', 'a secret pushed', -0.2), 0.009, px(980), 260)
P_ec = G('close', 'breath')
bone(Bb2, P_ec + 0.3, E('close') - 0.3, 0.7, 0.0, att=0.3, rel=0.9)
jaw(F4, P_ec + 0.7, 0.62, 0.0, 'mid')
jaw(D4, P_ec + 1.9, 0.62, 0.0, 'mid'); jaw(Bb3, P_ec + 2.4, 0.66, 0.0, 'round')
