#!/usr/bin/env python3
"""Each film's tile: a square close-up of its poster, for the rows of films on a series' page.

    python site-tools/tiles.py           # cut every tile that is missing or out of date
    python site-tools/tiles.py --check   # list them, and exit with 1 if any (check_site.py runs the same check)

A wide poster shrunk to a row's thumbnail read as a thin dark strip on a phone (Rodrigo, 20 November 2026). So each row shows a
square cut from the poster, close on one thing the film is about: the porter and his mule at the station, the cave's bulls, the
cash register. A film names its cut in its own site.json, as "tile": [x, y, size], in the poster's pixels (1280 by 720): the
centre of the square and its side. A film whose page is written by hand (HAND in build_series.py) names it there, as tile=[...].

Choose the cut by looking at the poster, and at the tiles of the series side by side: within one page no two should look alike
(another subject, another framing, another colour), and words on the poster should be whole or left out. A side under about
300 px goes soft on a phone.

The tile is site/assets/<poster name with -tile for -poster>.jpg, 360 px square, and carries a stamp naming the poster it was
cut from (the first 16 hex digits of its SHA-256) and the cut, so a poster drawn again (tools/publish.py) or a cut changed
leaves it out of date, and check_site.py says so."""
import hashlib, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build_series as B  # noqa: E402

SIZE = 360
STAMP = "Cut by site-tools/tiles.py from {poster} {sha} at {x},{y},{s}"


def wanted():
    """Every tile a series' page shows: [(poster file name, its cut or None, where the cut is written)]."""
    out = []
    for S in B.SERIES:
        for f in B.films(S)[1]:
            out.append((f'{f["key"]}-poster.jpg', f["site"].get("tile"), f'films/{S["dir"]}/{f["dir"]}/site.json'))
        for _, i, h, _ in B.outside(S):
            out.append((h["poster"]["en"], h.get("tile"), f"site-tools/build_series.py, HAND[{i!r}]"))
    return sorted(set((p, tuple(c) if c else None, w) for p, c, w in out))


def tile_name(poster):
    return poster.replace("-poster.jpg", "-tile.jpg") if poster.endswith("-poster.jpg") else poster[:-4] + "-tile.jpg"


def comments(b):
    """the comments (COM segments) in a JPEG's headers"""
    out, i = [], 2
    while b[:2] == b"\xff\xd8" and i + 4 <= len(b) and b[i] == 0xFF and b[i + 1] != 0xDA:
        n = int.from_bytes(b[i + 2:i + 4], "big")
        if b[i + 1] == 0xFE:
            out.append(b[i + 4:i + 2 + n].decode("utf-8", "replace"))
        i += 2 + n
    return out


def stamp(poster, cut):
    sha = hashlib.sha256((B.WEB / "assets" / poster).read_bytes()).hexdigest()[:16]
    return STAMP.format(poster=poster, sha=sha, x=cut[0], y=cut[1], s=cut[2])


def faults():
    """[(poster, cut, what's wrong)] for every tile that is missing, out of date, or has no cut to make it from."""
    out = []
    for poster, cut, where in wanted():
        tile = B.WEB / "assets" / tile_name(poster)
        if not cut:
            out.append((poster, None, f'{where}: no "tile" to cut {tile_name(poster)} from: name a square of the poster, [x, y, size]'))
            continue
        x, y, s = cut
        if not (isinstance(s, int) and 200 <= s <= 720 and s // 2 <= x <= 1280 - s // 2 and s // 2 <= y <= 720 - s // 2):
            out.append((poster, None, f'{where}: "tile" {list(cut)} isn\'t a square inside the 1280 by 720 poster, at least 200 px'))
            continue
        if not (B.WEB / "assets" / poster).exists():
            continue  # the poster's own check says so
        if not tile.exists():
            out.append((poster, cut, f"site/assets/{tile.name}: missing: run python site-tools/tiles.py"))
        elif stamp(poster, cut) not in comments(tile.read_bytes()):
            out.append((poster, cut, f"site/assets/{tile.name}: cut from another poster or another square than {where} names: "
                                     "run python site-tools/tiles.py"))
    return out


def cut(poster, c):
    from PIL import Image
    x, y, s = c
    im = Image.open(B.WEB / "assets" / poster).convert("RGB")
    im = im.crop((x - s // 2, y - s // 2, x - s // 2 + s, y - s // 2 + s)).resize((SIZE, SIZE), Image.LANCZOS)
    im.save(B.WEB / "assets" / tile_name(poster), quality=84, optimize=True, progressive=True, comment=stamp(poster, c).encode())


def main():
    bad = faults()
    if "--check" in sys.argv:
        for _, _, m in bad:
            print(m)
        sys.exit(1 if bad else 0)
    left = []
    for poster, c, m in bad:
        if c:
            cut(poster, c)
            print(f"cut site/assets/{tile_name(poster)}")
        else:
            left.append(m)
    for m in left:
        print(m)
    sys.exit(1 if left else 0)


if __name__ == "__main__":
    main()
