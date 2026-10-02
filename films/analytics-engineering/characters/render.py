"""Render the character card for the series' new character: python render.py
Writes card-jun.jpg with When things go wrong's card layout (../../when-things-go-wrong/characters/sheet.js): three poses
and three expressions. Needs the packages of the first film's source (films/inner-life-of-data/source/requirements.txt)."""
import base64, pathlib, subprocess
import imageio_ffmpeg
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
WTGW = HERE.parents[1] / 'when-things-go-wrong' / 'characters'
REPO = HERE.parents[2]
FF = imageio_ffmpeg.get_ffmpeg_exe()
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page()
    pg.add_init_script("window.__RENDER__=true")
    pg.goto((WTGW / 'sheet.html').as_uri()); pg.evaluate("window.__SHEET__")
    pg.add_script_tag(path=str(HERE.parent / 'shared' / 'src' / 'people.js'))
    pg.evaluate("EPI.jun='In the weeds of data crafting'")
    d = pg.evaluate("()=>{const c=document.createElement('canvas');c.width=1920;c.height=1080;card(c.getContext('2d'),'jun',0);return c.toDataURL('image/png');}")
    b.close()
subprocess.run([FF, '-y', '-loglevel', 'error', '-f', 'png_pipe', '-i', '-', '-q:v', '3', str(HERE / 'card-jun.jpg')], input=base64.b64decode(d.split(',')[1]), check=True)
print('wrote card-jun.jpg')
