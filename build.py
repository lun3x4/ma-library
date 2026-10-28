#!/usr/bin/env python3
"""Scanne le dossier Musics/ et génère Musics/library.json."""
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(ROOT, 'Musics')
AUDIO = ('.mp3', '.m4a', '.wav', '.ogg', '.flac', '.aac', '.opus')
IMG = ('.jpg', '.jpeg', '.png', '.webp')

def find_cover(d, names=('cover', 'folder')):
    for f in sorted(os.listdir(d)):
        s, x = os.path.splitext(f)
        if s.lower() in names and x.lower() in IMG:
            return f
    return None

def parse(stem):
    stem = stem.lstrip('0123456789 ._-') if stem[:2].isdigit() else stem
    if ' - ' in stem:
        a, t = stem.split(' - ', 1)
        return a.strip(), t.strip()
    return 'Unknown', stem.strip()

lib = {'owner': 'me', 'playlists': [], 'events': [], 'artists': {}}
for name, key in (('config.json', None), ('events.json', 'events')):
    p = os.path.join(M, name)
    if os.path.exists(p):
        data = json.load(open(p, encoding='utf8'))
        if key: lib[key] = data
        else: lib['owner'] = data.get('owner', 'me')

for name in sorted(os.listdir(M)):
    d = os.path.join(M, name)
    if not os.path.isdir(d): continue
    if name == '_artists':
        for f in os.listdir(d):
            s, x = os.path.splitext(f)
            if x.lower() in IMG: lib['artists'][s] = f'Musics/_artists/{f}'
        continue
    if name.startswith('_'): continue
    tracks = []
    for f in sorted(os.listdir(d)):
        s, x = os.path.splitext(f)
        if x.lower() in AUDIO:
            a, t = parse(s)
            tracks.append({'title': t, 'artist': a, 'src': f'Musics/{name}/{f}'})
    if tracks:
        c = find_cover(d)
        lib['playlists'].append({'name': name, 'cover': f'Musics/{name}/{c}' if c else None, 'tracks': tracks})

json.dump(lib, open(os.path.join(M, 'library.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(f"{len(lib['playlists'])} playlists, {sum(len(p['tracks']) for p in lib['playlists'])} titres")
