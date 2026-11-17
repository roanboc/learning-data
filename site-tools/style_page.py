"""docs/styles/index.html: what each look costs to draw, from the numbers style_stats.py measured.

    python site-tools/style_stats.py --page

The page is made from site-tools/style_page.html (its words, layout and script) and docs/styles/stats.json (the numbers): this
file only adds the numbers up, for each look, each series and each film. The page shows nothing that isn't in stats.json, and a
sentence that states a number takes it from there, so the page stays true when the films are measured again.

- docs/styles/index.html: the page, with its pictures beside it (docs/styles/img/<look>.jpg, drawn by --stills);
- --artifact FILE: the same page as one file with its pictures inside, to share for review.
"""
import base64, collections, datetime, json, pathlib, statistics

import style_stats as S

BUDGET = 1000 / 30                      # the time one frame has at 30 a second, in ms
TPL = pathlib.Path(__file__).with_name('style_page.html')
DEVICES = ('slow', 'half', 'fast')
NAMES = {'a-sharper-sketch': 'A sharper sketch', 'inner-life-of-data': 'The Inner Life of Data', 'making-of': 'Making of',
         'when-things-go-wrong': 'When things go wrong'}   # the series with no series.json


def q(v, p):
    """The value a share p of v is under."""
    v = sorted(v)
    if not v:
        return None
    i = (len(v) - 1) * p
    lo = int(i)
    hi = min(lo + 1, len(v) - 1)
    return v[lo] + (v[hi] - v[lo]) * (i - lo)


def r1(v):
    return None if v is None else round(v, 1)


def series_name(folder):
    f = S.ROOT / 'films' / folder / 'series.json'
    return (json.loads(f.read_text()).get('title') if f.exists() else None) or NAMES.get(folder) or folder.replace('-', ' ').capitalize()


def moments(films, dev):
    """Every timed moment of these films on one device, each with its film's name."""
    return [dict(m, film=f['name']) for f in films for m in f.get(dev, []) if 'ms' in m]


def device(ms):
    """What a set of moments says: the middle frame, how much of it is the film's script, a heavy moment, the heaviest, and its
    people: one person in the middle moment of those with people (a mean over every person would follow the few moments that
    draw a crowd), how much of those moments is people, and what such a moment takes."""
    if not ms:
        return None
    t = [m['ms'] for m in ms]
    worst = max(ms, key=lambda m: m['ms'])
    ppl = [dict(m, people=m['ppn']) for m in ms if m.get('ppn')]      # the people of a moment, as the painted pass counted them
    each = [m['pp'] / m['people'] for m in ppl]                       # one person in each of those moments
    return {'n': len(ms), 'ms': r1(q(t, .5)), 'share': round(sum(m['js'] for m in ms) / sum(t), 3), 'p90': r1(q(t, .9)),
            'max': {'v': r1(worst['ms']), 'film': worst['film'], 't': worst['t']},
            'within': round(sum(1 for x in t if x <= BUDGET + 0.05) / len(t), 3),
            'person': round(q(each, .5), 2) if each else None,
            'pshare': round(min(1, sum(m['pp'] for m in ppl) / sum(m['ms'] for m in ppl)), 3) if ppl else None,
            'pms': r1(q([m['ms'] for m in ppl], .5)) if ppl else None,
            'people': q([m['people'] for m in ppl], .5) if ppl else 0, 'most': max((m['people'] for m in ppl), default=0),
            'withp': round(len(ppl) / len(ms), 3),
            'heavy': [{'film': m['film'], 't': m['t'], 'ms': r1(m['ms'])} for m in sorted(ms, key=lambda m: -m['ms'])[:3]]}


def once(films):
    """What doesn't change with the device: the longest wait for a first picture, what a film keeps, and what it sends."""
    first = [(max(m['first'] for m in f['slow'] if 'first' in m), f['name']) for f in films if any('first' in m for m in f.get('slow', []))]
    kept = [(f['kept']['mb'], f['name']) for f in films if 'kept' in f]
    sent = [f for f in films if 'player_gz_kb' in f]
    out = {}
    if first:
        w = max(first)
        out['first'] = {'med': round(statistics.median(v for v, _ in first)), 'max': {'v': round(w[0]), 'film': w[1]}}
    if kept:
        w = max(kept)
        out['kept'] = {'med': round(statistics.median(v for v, _ in kept)), 'max': {'v': round(w[0]), 'film': w[1]}}
    if sent:
        out['player'] = round(statistics.median(f['player_gz_kb'] for f in sent))
        out['pictures'] = {'kb': round(statistics.median(f.get('pictures_kb', 0) for f in sent)), 'n': round(statistics.median(f.get('pictures', 0) for f in sent)),
                           'films': sum(1 for f in sent if f.get('pictures'))}
    return out


def film_row(key, f, look, series):
    d = {dev: device(moments([f], dev)) for dev in DEVICES}
    o = once([f])
    return {'key': key, 'name': f['name'], 'look': look, 'series': series,
            'd': {dev: ({'ms': x['ms'], 'max': x['max']['v'], 'person': x['person'], 'most': x['most']} if x else None) for dev, x in d.items()},
            'first': o.get('first', {}).get('med'), 'kept': o.get('kept', {}).get('med'), 'sent': (o.get('player') or 0) + o.get('pictures', {}).get('kb', 0)}


def aggregate(data, versions=()):
    """The page's numbers: every look in the order of LOOKS, every film, and the versions of one film to set side by side."""
    films = {k: f for k, f in data['films'].items() if 'slow' in f}
    order = {f['key']: i for i, f in enumerate(S.films())}
    looks = []
    for lid, name, module, what, _ in S.LOOKS:
        mine = sorted((k for k, f in films.items() if f.get('look') == lid), key=lambda k: order.get(k, 1e9))
        if not mine:
            continue
        fs = [films[k] for k in mine]
        ser = []
        for folder in dict.fromkeys(f['series'] for f in fs):
            sf = [f for f in fs if f['series'] == folder]
            ser.append({'name': series_name(folder), 'films': len(sf), 'ms': {dev: (device(moments(sf, dev)) or {}).get('ms') for dev in DEVICES}})
        used = collections.Counter(x for f in fs for x in f.get('person_fns', []))
        fns = sorted(used, key=lambda x: (-used[x], x))             # what draws the look's people, the most used first
        looks.append(dict({'id': lid, 'name': name, 'module': module, 'what': what, 'films': len(fs), 'series': ser, 'person_fns': fns,
                           'd': {dev: device(moments(fs, dev)) for dev in DEVICES}}, **once(fs)))
    rows = [film_row(k, f, f.get('look'), series_name(f['series'])) for k, f in sorted(films.items(), key=lambda kv: order.get(kv[0], 1e9))]
    vs = []
    for v in versions:
        f = v['film']
        vs.append(dict({'name': v['name'], 'note': v['note'], 'look': v['look'], 'film': f['name'], 'd': {dev: device(moments([f], dev)) for dev in DEVICES}}, **once([f])))
    return {'measured': data.get('measured') or datetime.date.today().strftime('%-d %B %Y'), 'moments': S.MOMENTS, 'budget': round(BUDGET, 1),
            'floor': data.get('floor'), 'looks': looks, 'films': rows, 'versions': vs,
            'count': {'films': len(rows), 'looks': len(looks), 'series': len({r['series'] for r in rows}), 'moments': sum(l['d']['slow']['n'] for l in looks),
                      'failed': sorted(k for k, f in data['films'].items() if 'slow' not in f)}}


def versions_of(out, data):
    """One film in its versions (docs/styles/versions.json, written by style_stats.py --keep-version): earlier ones carry their own
    numbers, and one without numbers is the film as stats.json has it now. The page shows the first film that has versions."""
    f = out / 'versions.json'
    vs = json.loads(f.read_text()) if f.exists() else []
    key = vs[0]['key'] if vs else None
    return [dict(v, film=v['film'] or data['films'].get(key)) for v in vs if v['key'] == key and (v['film'] or 'slow' in data['films'].get(key, {}))]


def page(out, inline=False):
    data = json.loads((out / 'stats.json').read_text())
    agg = aggregate(data, versions_of(out, data))
    for l in agg['looks']:
        pic = out / 'img' / (l['id'] + '.jpg')
        l['img'] = ('data:image/jpeg;base64,' + base64.b64encode(pic.read_bytes()).decode() if inline else 'img/' + pic.name) if pic.exists() else None
    head, body = TPL.read_text().split('<!--BODY-->')
    body = body.replace('__DATA__', json.dumps(agg, separators=(',', ':')).replace('</', '<\\/'))
    return head, body, agg


def write(out):
    head, body, agg = page(out)
    doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
           + head.strip() + '\n</head>\n<body>\n' + body.strip() + '\n</body>\n</html>\n')
    (out / 'index.html').write_text(doc)
    print('docs/styles/index.html: %d looks, %d films, %d KB' % (agg['count']['looks'], agg['count']['films'], len(doc) // 1024))
    if agg['count']['failed']:
        print('not measured:', ', '.join(agg['count']['failed']))


def write_artifact(out, dest):
    head, body, _ = page(out, inline=True)
    pathlib.Path(dest).write_text(head.strip() + '\n' + body.strip() + '\n')
    print(dest, pathlib.Path(dest).stat().st_size // 1024, 'KB')
