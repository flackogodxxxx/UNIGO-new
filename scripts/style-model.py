from zipfile import ZipFile
from pathlib import Path
from PIL import Image
import io
p=Path('public/models/Textures');p.mkdir(exist_ok=True)
with ZipFile('car-kit.zip') as z:
 image=Image.open(io.BytesIO(z.read('Models/GLB format/Textures/colormap.png'))).convert('RGBA')
 colors=[(13,19,33),(29,45,68),(62,92,118),(116,140,171),(240,235,216)]
 out=[]
 for r,g,b,a in image.getdata():
  lum=(r*.2126+g*.7152+b*.0722)/255
  c=colors[min(4,int(lum*5))]
  out.append((*c,a))
 image.putdata(out);image.save(p/'colormap.png')
 print(image.size)
