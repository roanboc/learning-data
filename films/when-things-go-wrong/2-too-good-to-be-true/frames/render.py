"""Render the style frames for Too good to be true: python render.py (or python render.py gauge reload, to render only some).
Writes one <id>.jpg per frame, and frames.jpg, all four two by two.
Needs the packages of the first film's source (films/inner-life-of-data/source/requirements.txt)."""
import base64,pathlib,subprocess,sys
import imageio_ffmpeg
from playwright.sync_api import sync_playwright
HERE=pathlib.Path(__file__).resolve().parent;FF=imageio_ffmpeg.get_ffmpeg_exe();ONLY=set(sys.argv[1:])
def jpg(data,out):
    subprocess.run([FF,'-y','-loglevel','error','-f','png_pipe','-i','-','-q:v','3',str(out)],input=base64.b64decode(data.split(',')[1]),check=True);print('wrote',out.name,flush=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page();errors=[]
    pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.add_init_script("window.__RENDER__=true");pg.goto((HERE/'frames.html').as_uri());pg.evaluate("window.__FRAMES__")
    pg.evaluate("window.RC=document.createElement('canvas');RC.width=1920;RC.height=1080;window.RX=RC.getContext('2d')")
    ids=pg.evaluate("FRAMES.map(f=>f[0])")
    for fid in ids:
        if not ONLY or fid in ONLY:jpg(pg.evaluate("()=>{RX.setTransform(1,0,0,1,0,0);DRAW['%s'](RX,2);return RC.toDataURL('image/png');}"%fid),HERE/(fid+'.jpg'))
    if not ONLY:
        jpg(pg.evaluate("""()=>{const Q=document.createElement('canvas');Q.width=1920;Q.height=1080;const q=Q.getContext('2d');q.fillStyle='#000';q.fillRect(0,0,1920,1080);
          FRAMES.forEach(([id],i)=>{RX.setTransform(1,0,0,1,0,0);DRAW[id](RX,2);q.drawImage(RC,(i%2)*960,Math.floor(i/2)*540,960,540);});
          q.strokeStyle='#05080f';q.lineWidth=6;q.beginPath();q.moveTo(960,0);q.lineTo(960,1080);q.moveTo(0,540);q.lineTo(1920,540);q.stroke();return Q.toDataURL('image/png');}"""),HERE/'frames.jpg')
    b.close()
    if errors:sys.exit('errors while drawing:\n'+'\n'.join(errors))
