import pathlib,base64
ROOT=pathlib.Path(__file__).resolve().parents[1];S=ROOT/'src';D=ROOT/'dist';D.mkdir(exist_ok=True)
FILES=['core.js','logos.js','style2.js','narration.js','vodur.js','ui3.js','scA.js','scB.js','scC.js','scD.js','engine3.js']
js='\n'.join((S/f).read_text() for f in FILES if (S/f).exists())
GF='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
(D/'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">'+GF+'<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n'+js+'\n</script></body></html>')
au=D/'soundtrack.mp3';tag='<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>'%base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
(D/'film.html').write_text((S/'page.html').read_text().replace('<!--FONTS-->',GF).replace('<!--AUDIO-->',tag).replace('/*JS*/',js))
print('built dist/render.html and dist/film.html','(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
