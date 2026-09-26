import pathlib,imageio_ffmpeg
ROOT=pathlib.Path(__file__).resolve().parents[1]
for _d in ['build/vo','build/chunks','dist']:(ROOT/_d).mkdir(parents=True,exist_ok=True)
import base64,subprocess,time,os
from playwright.sync_api import sync_playwright
FF=imageio_ffmpeg.get_ffmpeg_exe()
fps=30;CH=1500;D=str(ROOT/'build/chunks');t0=time.time()
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page(viewport={"width":1920,"height":1080})
    pg.goto((ROOT/'dist/render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000)
    n=int(pg.evaluate("filmInfo().total")*fps);names=[]
    for c0 in range(0,n,CH):
        fn='%s/c%05d.mp4'%(D,c0);names.append(fn)
        if os.path.exists(fn+'.ok'):continue
        proc=subprocess.Popen([FF,'-y','-loglevel','error','-f','image2pipe','-framerate',str(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',fn],stdin=subprocess.PIPE)
        for i in range(c0,min(n,c0+CH)):
            d=pg.evaluate("renderAt(%f,0.93)"%(i/fps));proc.stdin.write(base64.b64decode(d[23:]))
        proc.stdin.close();proc.wait();open(fn+'.ok','w').write('1');print('chunk',c0,'of',n,'%.0fs'%(time.time()-t0),flush=True)
    b.close()
open(D+'/list.txt','w').write(''.join("file '%s'\n"%f for f in names))
subprocess.run([FF,'-y','-loglevel','error','-f','concat','-safe','0','-i',D+'/list.txt','-c','copy',str(ROOT/'build/video.mp4')],check=True)
subprocess.run([FF,'-y','-loglevel','error','-i',str(ROOT/'build/video.mp4'),'-i',str(ROOT/'build/mix.wav'),'-map','0:v','-map','1:a','-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','48000','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',str(ROOT/'dist/inner-life-of-data.mp4')],check=True)
print('done','%.0fs'%(time.time()-t0),flush=True)
