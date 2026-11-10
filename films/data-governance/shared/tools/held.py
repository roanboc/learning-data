"""Held notes keep their own level in a room. quiet.py runs this check on every governance and agent film, after its other checks.

A room round the players is an echo: noise that dies away over a second or so, low-passed near 1.5 kHz, added to each note at a level
the score sets (room=0.3). Two things can make held notes sit at uneven levels in it (the PLAYBOOK's lesson, from Plan, define the
check, do, check and Context and memory, governed, 4 November 2026):
  - the room's level says less than it rings: an echo scaled by all the energy it holds (h / sqrt(sum(h ** 2))) keeps that energy
    under 1.5 kHz, so it rings about 10 dB louder there, where the notes are, than its level says, and the echo is as loud as the note;
  - even at the right level, the echo's reflections meet a pure, held note's own sound at its pitch, adding to it on one pitch and
    cancelling it on another, so one note of a chord came out 16 dB over another. Each held note is set back to its level without the
    room, measured over its body, not its start and end (_held() in a film's tools/score.py).
So this checks:
  - each room's gain where the notes are (100 Hz to 1.5 kHz) is within ROOM_DB of one;
  - no held note's level moves by more than MOVE_DB in the room. It plays the score again with every room silent (each convolution with
    an echo of RING seconds or more gives nothing) and compares each note on the music bus with itself: a note is held when it stays
    within 3 dB of its own level, after its first quarter second, for HOLD seconds or more, and its level is measured there;
  - no room is laid over the whole music bus while it holds notes: such a room moves every held note by where its echoes meet it, and
    no note can be set back after it, so give each note its own room.
Rooms are found as the score convolves with them (scipy.signal's fftconvolve, oaconvolve or convolve, the sound first and the echo
second), and each failure names the lines of tools/score.py that made the room or placed the note."""
import traceback
import numpy as np
import scipy.signal

BAND = (100.0, 1500.0)   # Hz: where the notes are, so where a room's gain is measured
RING = 0.25              # s: a convolution with something this long or longer is a room's echo
ROOM_DB = 3.0            # a room's gain where the notes are stays within this of one (0 dB)
MOVE_DB = 2.0            # the room may move a held note's level by at most this much, up or down
HOLD, NEAR, SKIP = 0.5, 3.0, 0.25   # s within NEAR dB of its own level, after its first SKIP s: a held note
FR = 0.01                # s: the frames a note's level is measured in


def gain_db(h, sr):
    """a room's gain where the notes are: its mean power from 100 Hz to 1.5 kHz, in dB (0 dB is one)"""
    h = np.asarray(h, np.float64)
    nf = 1 << int(np.ceil(np.log2(max(2, len(h)) * 2)))
    p = np.abs(np.fft.rfft(h, nf)) ** 2; f = np.fft.rfftfreq(nf, 1 / sr)
    return 10 * np.log10(max(1e-30, float(p[(f > BAND[0]) & (f < BAND[1])].mean())))


class Watch:
    """watches the score as it plays: the rooms it makes and each note it puts on the music bus. Make it before the score runs."""

    def __init__(self, music, score):
        self.music, self.score, self.sr = music, score, music.SR
        self.hop = int(round(FR * self.sr))
        self.zero, self.notes, self.rooms, self.buses = False, [], {}, []
        for name in ('fftconvolve', 'oaconvolve', 'convolve'):
            f = getattr(scipy.signal, name, None)
            if f is not None:
                setattr(scipy.signal, name, self._wrap(f))

    def where(self):
        """the lines of tools/score.py running now, outermost first"""
        return [f.lineno for f in traceback.extract_stack() if f.filename == self.score]

    def _wrap(self, f):
        def conv(in1, in2, *a, **k):
            out = f(in1, in2, *a, **k)
            h = np.asarray(in2)
            if h.ndim == 1 and len(h) >= RING * self.sr:
                ls = self.where(); key = ls[-1] if ls else 0
                if key not in self.rooms or len(h) > self.rooms[key][2]:
                    self.rooms[key] = (gain_db(h, self.sr), ls, len(h))
                if np.ndim(in1) == 1 and len(in1) >= self.music.N - self.sr:
                    self.buses.append(ls)
                if self.zero:
                    return np.zeros_like(out)
            return out
        conv.__wrapped__ = f
        return conv

    def note(self, sig, start, g, pan):
        """a sound put on the music bus: when, how loud as one speaker plays it, its level frame by frame, and the lines that put it"""
        sig = np.asarray(sig, np.float32)
        if not len(sig) or not g:
            return
        p = max(-1.0, min(1.0, pan)); mono = abs(g) * (np.sqrt(0.5 * (1 - p)) + np.sqrt(0.5 * (1 + p)))
        n = len(sig) // self.hop
        e = (sig[:n * self.hop].astype(np.float64).reshape(n, self.hop) ** 2).sum(1) if n else np.zeros(0)
        self.notes.append((start, len(sig), mono, e, self.where()))


def body(e):
    """the frames where a note is held: within NEAR dB of its own level after its first SKIP s, at least HOLD s of them; else None"""
    k = int(round(0.1 / FR))
    s = int(round(SKIP / FR))
    if len(e) < s + int(round(HOLD / FR)):
        return None
    lv = np.convolve(e, np.ones(k) / k, 'same')[s:]
    top = lv.max()
    if top <= 0:
        return None
    on = np.nonzero(lv >= top * 10 ** (-NEAR / 10))[0] + s
    return on if len(on) >= HOLD / FR else None


def check(w, again, mmss=lambda t: '%.1fs' % t, ALL=False):
    """the check, after the score has played once with w watching: plays it again with every room silent (again() must play it, with
    w still watching), and returns the failures, each a line"""
    fails = []
    lines = lambda ls: 'tools/score.py line%s %s' % ('s' if len(set(ls)) > 1 else '', ', '.join(str(x) for x in sorted(set(ls))))
    if not w.rooms:
        print('rooms: none (no echo for held notes to keep their level in)')
        return fails
    loud = sorted(((db, ls) for db, ls, _ in w.rooms.values()), key=lambda x: -abs(x[0]))
    print('rooms: %s; each rings within %.0f dB of one from %d Hz to %.1f kHz, where the notes are' % (
        ', '.join('line %d at %+.1f dB' % (ls[-1], db) for db, ls in sorted(loud, key=lambda x: x[1][-1])), ROOM_DB, BAND[0], BAND[1] / 1000))
    for db, ls in loud:
        if abs(db) > ROOM_DB:
            fails.append('the room at %s rings %+.1f dB from 100 Hz to 1.5 kHz, where the notes are, not about one (at most %.0f dB off): '
                         'scale its echo by its gain there, not by all the energy it holds' % (lines(ls[-1:]), db, ROOM_DB))
    A = w.notes; w.notes = []; w.zero = True
    try:
        again()
    finally:
        w.zero = False
    B = w.notes
    if len(A) != len(B) or any(abs(a[0] - b[0]) > 1e-6 or a[1] != b[1] for a, b in zip(A, B)):
        print('held notes: the score placed other notes with its rooms silent (%d against %d), so their levels can\'t be compared' % (len(B), len(A)))
        return fails
    moved = []
    for a, b in zip(A, B):
        on = body(b[3])
        if on is None:
            continue
        d = 10 * np.log10(max(1e-30, float(a[3][on].sum())) / max(1e-30, float(b[3][on].sum())))
        moved.append((d, a[0], a[4]))
    if not moved:
        print('held notes: none')
    else:
        ds = np.array([m[0] for m in moved])
        print('held notes: %d; the room moves their levels by %+.1f to %+.1f dB (at most %.0f dB either way)'
              % (len(moved), ds.min(), ds.max(), MOVE_DB))
        bad = sorted([m for m in moved if abs(m[0]) > MOVE_DB], key=lambda m: -abs(m[0]))
        for d, t, ls in (bad if ALL else bad[:6]):
            print('  %s  a held note %s by %.1f dB in the room (%s)' % (mmss(t), 'louder' if d > 0 else 'quieter', abs(d), lines(ls)))
        if bad:
            fails.append('%d held notes made louder or quieter by the room by more than %.0f dB (%+.1f to %+.1f dB), so held notes sit at '
                         'uneven levels: set each held note back to its level without the room, measured over its body (a _held() in '
                         'tools/score.py)' % (len(bad), MOVE_DB, ds.min(), ds.max()))
    if w.buses and moved:
        fails.append('a room laid over the whole music bus (%s) moves every held note by where its echoes meet it, and no note can be '
                     'set back after it: give each note its own room, and set each held note back to its level'
                     % lines({x for ls in w.buses for x in ls[-1:]}))
    return fails
