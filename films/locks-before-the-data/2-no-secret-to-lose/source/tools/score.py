# No secret to lose: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette this film reserved in the module's list (/mnt/project-files/data-protection/palettes.md, 5 November 2026), in no other
# score: an English concertina and a prepared piano, both made here (music.py has neither).
#  - The English concertina is Charles Wheatstone's free-reed instrument of 1829, made in London: one reed to a note, so a chord is
#    pressed on its buttons and every note of it is a single, steady reed, with no second reed tuned a little apart to make it waver
#    (an accordion's musette). The bellows are drawn softly: each reed speaks a moment after its button, holds one level, and stops.
#    It plays the opening's City and the Bank, and on the job's ladder each rung is a chord pressed on its buttons, from B minor at
#    the bottom (a person's token) to D major at the top (an identity the platform gives the job).
#  - The prepared piano: rubber and felt between its strings, muted and wooden, as music of the 1940s prepared one. Each secret is a
#    sealed note, short, in the bass: the bearer paper of 1990, Jun's token and each of its copies (the same note, as every copy works as
#    well as the first), each secret on the lower rungs, a password and its copy in a fake page. It rings no more once the secret is
#    gone: no note for the top two rungs, none for a passkey, none when Jun's token is ended, only the stamp.
#  - The one urgent pulse is the City's (film.json lists "city" in "urgent"): the messenger's steps in the quiet street, a muted low D
#    from the prepared piano on each step (a step every 0.6 s, as src/scenes.js walks him), going on after the case is taken, under
#    the 301 papers and their worth, until the money is gone.
#  - Keys, all tuned pure (just intonation from D, see hz()): D major and its chords that are pure here (D, G, A, B minor and F sharp
#    minor; E minor isn't, so it's never played), B minor for the risk.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story (the City and the Bank, film.json's "story"), and after it only at a
#    chapter's turn, under a moment on screen or in a pause without words; never a bed under the voice. After the opening, a secret's
#    sealed note as its card appears, a rung's chord as the rung is drawn, and a chord where a picture resolves; the rest is silence.
#  - Nothing trembles or pulses (no tremolo, no vibrato, no slides) except the City's steps.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: paper as a card or a sheet is laid down, a soft knock as a pill or a
#    stamp lands, keys as the Bank's screen is typed, a tap as a tick lights, a breath of air as a line is drawn or papers fly, and the
#    vault door's thud as it shuts.
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
def END(sid, lid):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
def sine_at(p):
    """when ag_sine(u) reaches p: the u at which an eased move is that far along"""
    return float(np.arccos(1 - 2 * min(1.0, max(0.0, p))) / np.pi)
R1 = np.random.default_rng(1829)  # this film's own randomness: the room

# ---- tuning: just intonation from D, so the notes of a chord are whole-number ratios of each other and nothing beats. D major (D F#
# A), G major (G B D), A major (A C# E), B minor (B D F#) and F sharp minor (F# A C#) are pure here; E minor (E G B) isn't, so the score
# never plays E with G or B
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (50, 146.832)  # D 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
A1, D2, A2, B2, D3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, Fs5 = 33, 38, 45, 47, 50, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 78

# ---- the levels: the concertina about as far under the voice as the module's other music (matched by loudness, not by peak), the
# piano's sealed notes a little under it, as they're struck; the effects about 12 dB under the music (FX scales them all)
CL, PL, FX = 0.064, 0.092, 1.4

# a small room round the players, ringing on for about a second and a quarter, and nothing much above 1.5 kHz. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one, so `room` is its share), and a held note is set back to
# the level it had before the room (_held), so the room colours a note but never moves it
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s
def _held(s, room, a, b):
    """a held note in the room, at its own level: set back to the level it had before the room, measured over its body (a to b
    seconds, once it has come in and before it lets go). A note too short to have a body just goes into the room"""
    r = _room(s, room); i, j = int(a * SR), int(b * SR)
    if not room or j - i < int(0.3 * SR):
        return r
    return r * float(np.sqrt((s[i:j] ** 2).mean() / max(1e-12, (r[i:j] ** 2).mean())))

# ---- the English concertina: a free reed's tone, its partials falling a little more slowly than 1/k, with the warm hump of the
# instrument's small wooden ends near 900 Hz, and little above 1.6 kHz. One reed to a note, held at one pitch and one level
def _reed(f, x, bright=1600):
    s = np.zeros(len(x))
    for k in range(1, int(2400 // f) + 1):
        fk = f * k
        s += k ** -1.05 / (1 + (fk / bright) ** 2) * (1 + 0.55 * np.exp(-((fk - 900) / 380) ** 2)) * np.sin(2 * np.pi * fk * x + 0.9 * k)
    return s

def conc(ms, a, b, g=1.0, att=0.14, rel=0.32, pan=0.0, room=0.3, bright=1600, stag=0.014):
    """the concertina: the notes ms pressed together (a chord) or one note, from a to b, the bellows drawn softly; each reed speaks a
    moment after its button (stag apart, the lowest first), holds one level, and stops"""
    sec = max(0.15, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n, dtype=np.float64) / SR; out = np.zeros(n)
    for i, m in enumerate(sorted(ms)):
        d = stag * i; xi = np.maximum(0.0, x - d); body = sec - d
        e = np.where(x < d, 0.0, np.where(xi < body, np.sin(0.5 * np.pi * np.minimum(xi / att, 1)) ** 2,
                                          np.cos(0.5 * np.pi * np.minimum((xi - body) / rel, 1)) ** 2 * (xi < body + rel)))
        out += e * _reed(hz(m), xi, bright) * (1.0 if i == 0 else 0.82)
    s = filt((out / max(1e-9, float(np.abs(out).max()))).astype(np.float32), 'low', 2200)
    put(_held(s, room, att + stag * len(ms), sec).astype(np.float32), a, g * CL, pan)

def tune(notes, t0, g=0.9, pan=0.0, room=0.3):
    """a slow line on the concertina: (note or chord, seconds) one after another, each reed let go as the next is pressed"""
    for m, sec in notes:
        conc(m if isinstance(m, (tuple, list)) else (m,), t0, t0 + sec - 0.06, g, att=0.12, rel=0.22, pan=pan, room=room)
        t0 += sec
    return t0

# ---- the prepared piano: a string with rubber and felt between it and its neighbours, so it is muted and wooden: a short note in the
# bass, its partials (whole multiples, so nothing beats) gone within half a second, and the hammer's dull knock under it. A secret's
# sealed note
_PREP = ((1.0, 1.0, 0.34), (2.0, 0.42, 0.18), (3.0, 0.2, 0.1), (4.0, 0.09, 0.07), (5.0, 0.05, 0.05))
def prep(m, t0, g=1.0, pan=0.0, room=0.24, sec=0.9):
    """one sealed note on the prepared piano, at t0"""
    f = hz(m); n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for r, ar, d in _PREP:
        if f * r < 2200:
            s += ar * np.exp(-x / d) * np.sin(2 * np.pi * f * r * x + 0.3 * r)
    s += 0.5 * np.exp(-x / 0.035) * np.sin(2 * np.pi * 62 * x)          # the felt on the string: a dull knock under the note
    s *= np.minimum(1, x / 0.004) * np.cos(0.5 * np.pi * np.clip((x - (sec - 0.2)) / 0.2, 0, 1)) ** 2
    s = filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 1800)
    put(_room(s, room).astype(np.float32), t0, g * PL, pan)

# ---- soft sounds, all low-passed
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a pill landing, a stamp"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, a light click: a tick lighting"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.009, pan=0.0, step=0.13):
    """a few keys typed on the Bank's terminal, the first two at g and the rest softer"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.65, pan)
def paper(s, g=0.014, pan=0.0, sec=0.45):
    """a card or a sheet laid down: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=1.0, g=0.009, pan=0.0, lo=140, hi=900):
    """something passing: a line drawn, a door swinging, papers flying: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def thud(s, g=0.02, pan=0.0):
    """the vault door shutting: a low, soft thud"""
    s_knock(s, g * FX, pan, 78)
def stamp(s, g=0.017, pan=0.0):
    """a stamp landing on a card: a soft knock, a little lower, and the card under it"""
    s_knock(s, g * FX, pan, 170); paper(s + 0.01, g * 0.45, pan, 0.18)

# =============================================================================================================================
# 1. The City, 2 May 1990: the opening, under the concertina. The street at morning: D major, pressed softly as the street comes up,
#    and a slow line in D under the money markets and their promises; the papers fan out; the messenger's route drawn across the City
#    and the payment coming back. Bearer paper: its slip, and the first sealed note on the prepared piano. That morning, in the quiet
#    street: the messenger's steps are the pulse, a muted low D on each step, on after the case is taken; a breath as the shadow comes
#    up the wall; the case taken; "Taken"; the 301 papers, their worth, their slip now the thief's (the sealed note, lower); they fly
#    away as the money is gone, and the pulse fades. Every messenger: B minor over the moving cases, and F sharp alone as they stop
cw = lambda lid, word, off=0: W('city', lid, word, off)
cc = lambda lid, off=0: G('city', lid, off)
c0 = S0('city')
conc((D4, Fs4, A4), c0 + 0.7, cc('paper', -0.3), 0.85, att=1.4, rel=0.9, pan=0.0)
tune([(A4, 1.5), (B4, 1.1), (A4, 1.1), (Fs4, 2.4)], cc('paper', 0.3), 0.8, -0.05)
P_prom = cw('promise', 'promises')
paper(P_prom + 0.2, 0.013, px(1530), 0.6)
tune([((G3, B3), 1.7), ((A3, Cs4), 1.5), ((Fs4, D4), 2.6)], P_prom + 0.6, 0.72, 0.05)
paper(P_prom + 0.6, 0.011, px(900))
P_msg = cw('walks', 'a messenger')
air(P_msg + 0.3, 1.6, 0.007, px(960), 200, 900)
tune([(D4, 0.9), (Fs4, 0.9), (A4, 1.2), (G4, 1.0), (Fs4, 2.0)], P_msg - 0.2, 0.62, -0.1)
paper(cw('walks', 'comes back'), 0.009, px(1100), 0.5)
P_bear = cw('bearer', 'bearer')
prep(D3, P_bear + 0.15, 0.9, px(1600))
paper(cw('bearer', 'whoever'), 0.011, px(900))
conc((B3, D4, Fs4), P_bear + 0.4, cc('morning', -0.6), 0.6, att=0.9, rel=0.8, pan=0.1)
# the quiet street: his steps, at the pulse's pace, from tW0 = "That morning" less 0.3 s (src/scenes.js), on until the money is gone
T_w0 = cc('morning', -0.3)
P_takes, P_gone = cw('morning', 'takes'), cw('gone', 'the money is gone')
step = lambda t, g, p: prep(D2, t, g, p, room=0.12, sec=0.5)
step5 = lambda t, g, p: prep(A1, t, g, p, room=0.12, sec=0.5)
pulse(T_w0, P_gone + 1.2, 100, [(0, step, 0.85, 0.15), (1, step, 0.7, 0.15), (2, step5, 0.8, 0.1), (3, step, 0.7, 0.15)], 1.0, 0.5)
air(P_takes - 0.6, 1.6, 0.008, px(1500), 110, 600)
knock(P_takes + 0.1, 0.014, px(1300), 190)
knock(P_takes + 2.4, 0.012, px(1240))
paper(cw('inside', 'three hundred', -0.1), 0.012, px(1530), 0.6)
paper(cw('inside', 'worth'), 0.011, px(1530))
prep(A2, cw('cash', 'as good as cash', 0.1), 0.75, px(1600))
air(P_gone + 0.3, 2.0, 0.011, px(1600), 160, 1000)
P_every = cc('every')
conc((B2, Fs3, B3, D4), P_every - 0.1, cc('change', -0.2), 0.7, att=1.1, rel=0.7, pan=0.0)
conc((Fs3,), cc('change', -0.2), cc('change', 2.2), 0.6, att=0.4, rel=1.0, pan=0.0)

# 2. The Bank of England's answer: G major, pressed softly as its front comes up; the Office opens: a card, and a line falling to rest.
#    The vault: the door swings shut, a thud, and the paper's sealed note, cut short by the door. The records: the terminal typed, the
#    sale, both sides' ticks, the owner changing: D major. Forty-four firms; the Bank's own words. The streets with no paper in their
#    hands: the City's line again, lighter. A password, a token or a key is bearer paper too: the sealed note, and "Whoever holds it,
#    is you"; the nightly job still carries one, a lower note. Nobody has to carry a secret: A major, into D major under the title
bw = lambda lid, word, off=0: W('bank', lid, word, off)
bc = lambda lid, off=0: G('bank', lid, off)
b0 = S0('bank')
conc((G3, B3, D4), b0 + 0.5, bc('opens', -0.3), 0.75, att=1.2, rel=0.9, pan=-0.05)
P_cmo = bw('opens', 'Central Money Markets Office')
paper(P_cmo, 0.013, px(960), 0.6)
tune([(D5, 1.2), (Cs5, 1.0), (B4, 1.0), (A4, 2.2)], P_cmo + 0.3, 0.62, 0.05)
P_stays = bw('vault', 'stays there')
air(P_stays, 1.8, 0.01, px(960), 100, 600)
thud(P_stays + 1.8, 0.022, px(960))
prep(D3, P_stays + 1.5, 0.8, px(960), sec=0.36)
P_kept = bw('records', 'kept')
keys(P_kept - 0.6, 4, 0.008, px(700))
for i in range(4):
    tap(P_kept + i * 0.3, 0.007, px(760))
P_sale, P_both = bw('sale', 'changes the record'), bw('sale', 'both sides')
keys(P_sale, 5, 0.008, px(760))
tap(P_both, 0.011, px(560)); tap(P_both + 0.8, 0.011, px(560))
knock(P_both + 2.0, 0.009, px(1100), 280)
conc((D4, Fs4, A4), P_both + 2.0, P_both + 4.0, 0.62, att=0.3, rel=0.6, pan=0.1)
paper(bw('first', 'Forty-four'), 0.012, px(1720))
paper(bw('why', 'why', 0.3), 0.013, px(960), 0.6)
P_st = bc('streets', -0.3)
tune([(A4, 1.1), (B4, 1.0), (A4, 1.0), (Fs4, 1.1), ((D4, Fs4), 1.8)], P_st + 0.5, 0.55, -0.05)
P_too = bw('too', 'bearer paper')
paper(P_too - 0.5, 0.011, px(640))
prep(D3, P_too - 0.3, 0.9, px(640))
paper(P_too + 0.3, 0.008, px(930), 0.3)
knock(bw('too', 'whoever holds it'), 0.012, px(640), 260)
P_job = bw('job', 'a nightly job')
prep(A2, P_job + 0.25, 0.8, px(1430))
P_carry = bw('nobody', 'carry a secret')
conc((A3, Cs4, E4), bc('nobody', 0.4), P_carry + 0.6, 0.62, att=0.9, rel=0.4, pan=0.05)
conc((D4, Fs4, A4, D5), P_carry + 0.6, bc('breath', 3.3), 0.7, att=0.6, rel=1.1, pan=0.0)

# 3. Jun's token. The clock at two, a tap; the job comes up from the door to its badge (air, and the badge laid down). Jun's token clipped
#    under it: its sealed note. Made 14 March 2024, no end date: two knocks. To the platform, whoever holds it is Jun: a line drawn; from
#    anywhere, at any hour: a tap for each. The copies Sam finds: the same sealed note for each, as each works as well as the first; how
#    many more. Jun moves: the line stretches. The quickest way to start: a card. Bearer paper through the streets: the slip, a low note
tw = lambda lid, word, off=0: W('token', lid, word, off)
tc = lambda lid, off=0: G('token', lid, off)
tap(tw('two', 'at two', -0.2), 0.008, px(825))
P_id = tw('own', 'an identity')
air(P_id - 0.2, 1.7, 0.007, px(1100), 160, 800)
paper(P_id + 1.6, 0.011, px(930))
prep(D3, tw('still', "Jun Park's", -0.2), 0.9, px(940))
knock(tw('made', 'fourteenth'), 0.01, px(820), 280); knock(tw('made', 'no end date'), 0.01, px(1100), 280)
air(tw('whoever', 'is Jun'), 0.9, 0.007, px(1400), 200, 1000)
for word in ('from anywhere', 'at any hour', 'for as long as'):
    tap(tw('reads', word), 0.007, px(560))
for word in ("the job's settings", 'an old notebook', 'a file'):
    prep(D3, tw('finds', word, 0.12), 0.75, px(1600))
knock(tw('copy', 'how many'), 0.011, px(1605))
air(tw('moves', 'moves'), 1.0, 0.007, px(1500), 200, 1000)
paper(tw('wrong', 'quickest'), 0.012, px(1530))
prep(A2, tw('streets', 'bearer paper', 0.15), 0.75, px(1250))

# 4. Who holds a secret? The rails drawn; the one question; then the job's ladder, each rung a chord pressed on the concertina as it's
#    drawn, rising from B minor to D major, and for the four rungs that keep a secret, its sealed note as the rung's card appears: a
#    person's token (B minor), the job's own (F sharp minor), a vault (G major; the card turned over by a machine, a knock; a copy, the
#    sealed note again), a certificate (A major; the signature drawn to the door; renewed). The two top rungs keep no secret, so no
#    note: a note from where it runs (G major, voiced higher; the note laid down and gone in at the door), an identity the platform
#    gives it (D major; vouched for, and the pass's two ticks). The goal: D major, fuller
lw = lambda lid, word, off=0: W('ladder', lid, word, off)
lc = lambda lid, off=0: G('ladder', lid, off)
air(lw('prove', 'prove', -0.4), 2.2, 0.006, px(1350), 200, 900)
paper(lw('ways', 'one question'), 0.012, px(440))
RUNGS = (('person', (B2, Fs3, B3, D4), D3), ('own', (Fs3, A3, Cs4), D3), ('vault', (G3, B3, D4), D3), ('cert', (A3, Cs4, E4), D3),
         ('note', (B3, D4, G4), None), ('top', (D4, Fs4, A4, D5), None))
for k, (cue, chord, sealed) in enumerate(RUNGS):
    t_ = lc(cue)
    conc(chord, t_ + 0.05, t_ + 1.7, 0.6 + 0.04 * k, att=0.18, rel=0.5, pan=0.08)
    if sealed:
        prep(sealed, t_ + 0.7, 0.8, px(1350))
paper(lw('rights', 'bearer paper'), 0.008, px(560), 0.3)
air(lw('vault', 'reads'), 0.6, 0.006, px(326), 200, 900)
knock(lw('vault', 'a machine changes', 0.5), 0.011, px(400), 300)
prep(D3, lw('types', 'a copy', 0.3), 0.75, px(470))
air(lw('signing', 'by signing'), 1.4, 0.007, px(700), 200, 1000)
knock(lw('renewed', 'renewed'), 0.01, px(330), 280)
paper(lw('signs', 'a short note'), 0.011, px(350))
air(lw('signs', 'lets it in'), 1.2, 0.007, px(600), 200, 900)
tap(lw('knows', 'vouches'), 0.009, px(600))
tap(lw('passes', 'a new one', 0.5), 0.008, px(220)); tap(lw('passes', 'within the hour', 0.1), 0.008, px(220))
P_goal = lc('goal')
conc((D3, A3, D4, Fs4, A4), P_goal + 0.6, P_goal + 3.6, 0.7, att=0.5, rel=1.0, pan=0.0)
paper(P_goal + 1.2, 0.011, px(440))

# 5. Up the ladder: the job climbs, a reed for each rung it passes, B, C sharp, D, E, F sharp, A, held on D major at the top. In the
#    hall: vouched for (a tap); decided when it got its name; the build service, its note, no secret stored. Jun ends his token: the
#    stamp, and no note, as the secret is gone; the copies stamped one by one. What a thief would find tonight: before, now (D major,
#    voiced low). Jun moves team, and nothing breaks: a tick. A system that can't climb yet: its password in a vault, the one sealed
#    note left; the machine turns it; the exception written down. Every new job starts at the top: D major, high
uw = lambda lid, word, off=0: W('climb', lid, word, off)
uc = lambda lid, off=0: G('climb', lid, off)
P_vch = uw('vouches', 'vouches')
c_a, c_b = uc('up', 0.2), P_vch - 0.6 - 0.7            # clU() in src/scenes.js: the climb, eased, from c_a to c_b (tHall - 0.7)
CLIMB = (B3, Cs4, D4, E4, Fs4, A4)
for k, m in enumerate(CLIMB):
    t_ = c_a + (c_b - c_a) * sine_at(k / 5)
    nxt = c_a + (c_b - c_a) * sine_at((k + 1) / 5) if k < 5 else t_ + 1.6
    conc((m,) if k < 5 else (D4, Fs4, A4), t_, max(t_ + 0.3, nxt - 0.04), 0.55, att=0.06, rel=0.25 if k < 5 else 0.8, pan=-0.2 + 0.08 * k)
tap(P_vch, 0.009, px(790))
knock(uw('role', "the loader role's", 0.2), 0.01, px(1290), 280)
knock(uw('build', 'the build service'), 0.009, px(250), 300)
paper(uw('build', 'signs a note'), 0.011, px(900))
knock(uw('build', 'no secret', 0.4), 0.01, px(250), 280)
stamp(uw('ends', 'ends', 0.35), 0.017, px(1300))
for word in ('the settings', 'the notebook', 'the laptop'):
    stamp(uw('worthless', word, 0.15), 0.012, px(1700))
paper(uw('before', 'Before'), 0.012, px(660))
P_now = uw('now', 'Now')
paper(P_now, 0.012, px(1260))
conc((D3, A3, Fs4), P_now + 0.2, P_now + 2.2, 0.6, att=0.4, rel=0.7, pan=0.1)
air(uw('never', 'moves team'), 1.4, 0.006, px(1760), 200, 900)
tap(uw('never', 'never his'), 0.01, px(1210))
knock(uw('cant', "can't climb"), 0.009, px(1450), 300)
P_pw = uw('cant', 'the password goes')
air(P_pw, 0.7, 0.006, px(1150), 200, 900)
prep(D3, P_pw + 0.5, 0.75, px(1570))
knock(uw('owner', 'A machine', 0.5), 0.01, px(1570), 300)
paper(uw('owner', 'written down'), 0.011, px(1570))
P_top = uw('starts', 'at the top')
conc((Fs4, A4, D5), P_top - 0.2, P_top + 2.2, 0.58, att=0.4, rel=0.9, pan=-0.1)

# 6. A ladder for people: the turn, G major, pressed softly as the rails are drawn. The shared account: "Who did what?". A password:
#    its sealed note, and again as its copy lands in a fake page. A code by text: the number moved (a breath). An app: yes (a tap); the
#    fake page passes it on (a breath). At the top, a passkey: D major, and no note, as nobody holds a secret: the face and the
#    fingerprint (two taps), the real site's tick; the fake page gets nothing, in silence; the matching half. Everyone signs in once:
#    a line rising, D, F sharp, A, as Sam, Jun and Mei come in, a tick at each name. Agents: signs in as itself; a person's token struck
pw = lambda lid, word, off=0: W('people', lid, word, off)
pc = lambda lid, off=0: G('people', lid, off)
conc((G3, D4, B4), S0('people') + 0.6, pc('too', 2.4), 0.6, att=0.8, rel=0.8, pan=0.05)
knock(pw('shared', 'who did what'), 0.011, px(330), 280)
prep(D3, pc('password', 0.9), 0.8, px(1350))
prep(D3, pw('password', 'a fake page', 0.55), 0.7, px(430))
air(pw('text', 'moved'), 1.4, 0.007, px(480), 200, 1000)
tap(pw('app', 'your yes'), 0.009, px(270))
air(pw('app', 'pass on'), 0.8, 0.006, px(460), 200, 900)
P_key = pc('passkey')
conc((A3, D4, Fs4, A4), P_key + 0.05, P_key + 2.2, 0.62, att=0.3, rel=0.8, pan=0.05)
tap(pw('unlock', 'your face'), 0.008, px(550)); tap(pw('unlock', 'your fingerprint'), 0.008, px(670))
tap(pw('real', 'the real site'), 0.01, px(275))
paper(pw('half', 'the matching half', -0.2), 0.011, px(275))
P_row = pc('once', -0.3)
tune([(D4, 1.2), (Fs4, 1.2), ((A4, D4), 2.4)], P_row + 0.5, 0.58, 0.0)
for word, x in (('Sam', 430), ('Jun', 960), ('Mei', 1490)):
    tap(pw('once', word, 0.1), 0.009, px(x))
knock(pw('agents', 'as itself'), 0.01, px(330), 280)
stamp(pw('agents', "a person's token", 0.4), 0.012, px(380))

# 7. Nothing to carry: the City's paper stopped travelling, the street with no cases: the City's line once more, slow. The job carries
#    nothing: the hall, vouched for. Nothing to leak, nothing to change on a schedule, nothing that breaks: a soft knock as each lands.
#    The best secret is the one nobody holds: D major under the end card, held to the end
ew = lambda lid, word, off=0: W('close', lid, word, off)
ec = lambda lid, off=0: G('close', lid, off)
tune([(A4, 1.3), (B4, 1.2), (A4, 1.2), (Fs4, 1.3), ((D4, Fs4, A4), 2.2)], ec('city', 0.3), 0.55, 0.0)
tap(ew('job', 'knows'), 0.008, px(790))
for word in ('nothing to leak', 'nothing to change', 'nothing that breaks'):
    knock(ew('nothing', word), 0.01, px(820), 300)
P_end = ec('breath')
conc((D3, A3, D4, Fs4, A4), P_end + 0.3, E('close') - 0.3, 0.66, att=1.0, rel=1.4, pan=0.0)
