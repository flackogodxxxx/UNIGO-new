from zipfile import ZipFile
from pathlib import Path
import json
with ZipFile('car-kit.zip') as z:
 print('\n'.join(n for n in z.namelist() if any(t in n.lower() for t in ['.glb','license','.png']) and 'preview' not in n.lower()))
