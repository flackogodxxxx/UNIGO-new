from zipfile import ZipFile
from pathlib import Path
import json,struct
p=Path('public/models');p.mkdir(exist_ok=True)
with ZipFile('car-kit.zip') as z:
 for src,dst in [('Models/GLB format/sedan.glb','sedan.glb'),('License.txt','LICENSE-Kenney.txt')]:
  (p/dst).write_bytes(z.read(src))
b=(p/'sedan.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+n]);print(json.dumps({'materials':d.get('materials'),'nodes':[x.get('name') for x in d['nodes']],'images':d.get('images'),'bytes':len(b)},indent=2))
