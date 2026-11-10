"""Render the character sheet for When things go wrong: python render.py (or python render.py lineup sam, to render only some of it).
Writes lineup.jpg, one card-<name>.jpg per character, through-the-screen.jpg (four moments of the shot) and through-the-screen.mp4.
Needs the packages of the first film's source (films/inner-life-of-data/source/requirements.txt)."""
import base64,pathlib,subprocess,sys
import imageio_ffmpeg
from playwright.sync_api import sync_playwright
HERE=pathlib.Path(__file__).resolve().parent;FF=imageio_ffmpeg.get_ffmpeg_exe();ONLY=set(sys.argv[1:])
def want(k):return not ONLY or k in ONLY
def jpg(data,out):
    subprocess.run([FF,'-y','-loglevel','error','-f','png_pipe','-i','-','-q:v','3',str(out)],input=base64.b64decode(data.split(',')[1]),check=True);print('wrote',out.name,flush=True)
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page()
    pg.add_init_script("window.__RENDER__=true");pg.goto((HERE/'sheet.html').as_uri());pg.evaluate("window.__SHEET__")
    pg.evaluate("window.RC=document.createElement('canvas');RC.width=1920;RC.height=1080;window.RX=RC.getContext('2d')")
    shot=lambda js:pg.evaluate("()=>{RX.setTransform(1,0,0,1,0,0);%s;return RC.toDataURL('image/png');}"%js)
    if want('lineup'):jpg(shot("lineup(RX,0)"),HERE/'lineup.jpg')
    for pid in pg.evaluate("ORDER"):
        if want(pid) or want('cards'):jpg(shot("card(RX,'%s',0)"%pid),HERE/('card-%s.jpg'%pid))
    if want('screen'):
        # four moments of the shot, two by two, then the whole shot as a seven-second video
        pg.evaluate("window.RQ=document.createElement('canvas');RQ.width=1920;RQ.height=1080;window.RQX=RQ.getContext('2d')")
        jpg(pg.evaluate("""()=>{RQX.fillStyle='#000';RQX.fillRect(0,0,1920,1080);[0.05,0.4,0.62,0.95].forEach((u,i)=>{RX.setTransform(1,0,0,1,0,0);throughScreen(RX,u,u*7);
          RQX.drawImage(RC,(i%2)*960,Math.floor(i/2)*540,960,540);});RQX.strokeStyle='#05080f';RQX.lineWidth=6;RQX.beginPath();RQX.moveTo(960,0);RQX.lineTo(960,1080);RQX.moveTo(0,540);RQX.lineTo(1920,540);RQX.stroke();return RQ.toDataURL('image/png');}"""),HERE/'through-the-screen.jpg')
        fps,secs=30,7;n=fps*secs;out=HERE/'through-the-screen.mp4'
        ff=subprocess.Popen([FF,'-y','-loglevel','error','-f','image2pipe','-framerate',str(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
        for i in range(n):
            d=pg.evaluate("()=>{RX.setTransform(1,0,0,1,0,0);throughScreen(RX,%f,%f);return RC.toDataURL('image/jpeg',0.92);}"%(i/(n-1),i/fps))
            ff.stdin.write(base64.b64decode(d.split(',')[1]))
        ff.stdin.close();ff.wait();print('wrote',out.name,flush=True)
    b.close()
