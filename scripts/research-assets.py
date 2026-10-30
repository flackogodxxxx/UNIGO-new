import urllib.request,re,json
from pathlib import Path
for key,url in [('campus','https://www.unifio.edu.br/sobre-a-unifio/'),('cars','https://kenney.nl/assets/car-kit')]:
 text=urllib.request.urlopen(url,timeout=30).read().decode()
 links=list(dict.fromkeys(re.findall(r'https?[^\s\"<>]+',text)))
 selected=[u for u in links if (('uploads' in u and any(e in u.lower() for e in ['.jpg','.png','.webp'])) if key=='campus' else '.zip' in u)]
 print(key,json.dumps(selected,ensure_ascii=False))
