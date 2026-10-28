# Your Library — lecteur musical mobile

Clone mobile de l'onglet « Your Library » : bibliothèque triable/filtrable, lecteur plein écran, mini‑player, recherche, playlists perso, likes, minuteur de sommeil, file d'attente, contrôles écran verrouillé (Media Session).

## Ajouter ta musique
Un **dossier = une playlist**, dans `Musics/` :

```
Musics/
  Ma Playlist/
    Artiste - Titre.mp3
    Artiste A, Artiste B - Titre.mp3   (plusieurs artistes séparés par une virgule)
    cover.jpg                          (optionnel)
  _artists/Artiste.jpg                 (optionnel : photo ronde d'un artiste)
  events.json                          (optionnel : concerts, voir exemple)
  config.json                          ({"owner":"ton pseudo"})
```
Formats : mp3, m4a, wav, ogg, flac, aac, opus.

## Mettre en ligne
1. Pousse le repo sur GitHub, puis **Settings → Pages → Deploy from branch → main / root**.
2. `Musics/library.json` est régénéré automatiquement à chaque push (GitHub Action).
   En local : `python build.py`, puis `python -m http.server` et ouvre `localhost:8000`.
3. Sur iPhone : Partager → « Sur l'écran d'accueil » pour l'avoir en plein écran.

> Respecte les droits d'auteur : ne publie que de la musique dont tu as les droits (un repo Pages est public).
