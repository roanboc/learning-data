"""Check the film before a long render: python tools/check.py
The agent films' check.py, unchanged (films/what-an-agent-is/shared/tools/check.py: every moment draws, no word under 28 px, every
place paints in time, nothing shows twice, no arm or camera jumps, nothing painted past a person's picture), then this module's own:
no row of torsos (rows.py, here), where people who act or meet in a place are lined up as half-figures in front of it."""
import runpy, sys
import rows
from lang import render_page, META
from run import AGT
from playwright.sync_api import sync_playwright

failed = []
try:
    runpy.run_path(str(AGT / 'check.py'), run_name='__main__')
except SystemExit as e:
    if e.code:
        failed.append(str(e.code))

with sync_playwright() as p:
    b, pg = render_page(p)
    msg, bad = rows.check(pg)
    b.close()
print('rows.py:', msg)
for l in bad:
    print('  ' + l)
if bad and META['key'] in rows.later():
    print('rows.py: %d rows of torsos, not failed yet: %s is in rows_later.json' % (len(bad), META['key']))
elif bad:
    failed.append('rows.py: %d rows of torsos: draw the people whole, in their place (lp_body), or fewer at a time' % len(bad))
elif META['key'] in rows.later():
    failed.append('rows.py: no rows left: take %s out of the-new-skills/shared/tools/rows_later.json' % META['key'])
if failed:
    sys.exit('\n'.join(failed))
