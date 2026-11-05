"""Check the film before a long render: python tools/check.py
First From words to data's checks, unchanged: every moment draws, 30 a second, as the video does, and the same words never show
twice where one chapter fades into the next (check.py and twice.py there). Then this series' own: the site's player keeps up
(smooth.py): drawn as the player draws it, with the places as pictures, no moment takes long, nothing slow is painted while the
film plays, and what it keeps stays within its budget, also with the processor slowed four times, as on a phone."""
import runpy, smooth
from lang import DIST, META, REPO
from run import FW
from playwright.sync_api import sync_playwright

failed = []
try:
    runpy.run_path(str(FW / 'check.py'), run_name='__main__')
except SystemExit as e:
    if e.code:
        failed.append(str(e.code))
with sync_playwright() as p:
    summary, faults = smooth.check(p, DIST / 'render.html', REPO / 'site' / 'assets' / META['key'] / 'places')
print(summary)
for l in faults:
    print('  ' + l)
if faults:
    failed.append('%d faults in how the site\'s player keeps up' % len(faults))
else:
    print('the site\'s player keeps up')
if failed:
    raise SystemExit('; '.join(failed))
