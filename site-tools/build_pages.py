"""Turn the Markdown pages in site/ into site pages. Run: python site-tools/build_pages.py (needs: pip install markdown)."""
import pathlib,re,markdown
ROOT=pathlib.Path(__file__).resolve().parents[1];WEB=ROOT/'site';SITE='https://roanboc.github.io/learning-data/'
TPL={'en':(ROOT/'site-tools/page.html').read_text(),'es':(ROOT/'site-tools/page.es.html').read_text()}
for md in sorted(p for d in ['journey','paths','es/journey','es/paths'] for p in WEB.glob(d+'/**/*.md')):
    rel=md.relative_to(WEB);lang='es' if rel.parts[0]=='es' else 'en'
    text=md.read_text()
    body=markdown.markdown(text,extensions=['tables','fenced_code','toc','attr_list'],extension_configs={'toc':{'toc_depth':'2-2'}})  # [TOC] lists the sections (h2) only
    base='../'*(len(rel.parts)-1);out=md.with_suffix('.html')
    # the page's heading and its italic subtitle open the page on the dark hero, like every other page; the subtitle is also its description
    hm=re.match(r'\s*(<h1[^>]*>.*?</h1>)\s*<p><em>(.*?)</em></p>\s*',body,re.S)
    h1,lead=(hm.group(1),hm.group(2)) if hm else ('','')
    body=body[hm.end():] if hm else body
    desc=re.sub(r'<[^>]+>','',lead).replace('"','&quot;')
    # "On this page": every section (h2), as a sidebar that follows the reader on wide screens and a bar that opens the list on phones;
    # the films at the top of the Making of page are their own group. assets/doc-nav.js marks the section being read.
    L={'en':('On this page','The films','The story','Sections'),'es':('En esta página','Las películas','La historia','Secciones')}[lang]
    fs,fe=body.find('<div class="making-films">'),body.find('</section>\n</div>')
    groups=[[],[]]
    for m in re.finditer(r'<h2 id="([^"]+)">(.*?)</h2>',body):
        text=re.sub(r'<[^>]+>','',m.group(2));film=fs>=0 and fs<m.start()<fe
        target=re.search(r'<section class="making-film" id="([^"]+)"[^>]*>\s*$',body[:m.start()]) if film else None
        groups[0 if film else 1].append((target.group(1) if target else m.group(1),text))
    nav=''
    if sum(map(len,groups))>=4:
        parts=[]
        for g,(label) in zip(groups,(L[1],L[2] if groups[0] else L[3])):
            if g:parts.append('<p class="doc-k">%s</p><ol>%s</ol>'%(label,''.join('<li><a href="#%s">%s</a></li>'%(i,t) for i,t in g)))
        nav=('<nav class="doc-nav" aria-label="%s"><button type="button" class="doc-nav-btn" aria-expanded="false" aria-controls="doc-toc" hidden><span class="doc-k">%s</span><span class="doc-now"></span></button>'
             '<div class="doc-toc" id="doc-toc">%s</div></nav>')%(L[0],L[0],''.join(parts))
    # the language toggle links each page to the same page in the other language: journey/ and es/journey/
    here=rel.parent.as_posix()+'/';en=here[3:] if lang=='es' else here
    out.write_text(TPL[lang].replace('{{base}}',base).replace('{{site}}',SITE).replace('{{en}}',en).replace('{{es}}','es/'+en).replace('{{h1}}',h1).replace('{{lead}}',lead).replace('{{description}}',desc).replace('{{nav}}',nav).replace('{{body}}',body));print('built',out.relative_to(ROOT))
