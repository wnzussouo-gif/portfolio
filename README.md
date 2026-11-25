# N'SPACE DEZIGN — Portfolio

Portfolio de designer graphique : logos, flyers, banderoles.
Site statique en HTML / CSS / JS, prêt à héberger sur GitHub Pages.

## Structure

```
├── index.html
├── style.css
├── script.js
├── LOGO/        → 38 logos
├── BANDEROLE/   → 9 banderoles
└── Flyers/      → (à compléter)
```

## Hébergement sur GitHub Pages

1. Crée un repository sur [github.com/new](https://github.com/new) (ex. `portfolio`)
2. Dans le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Portfolio initial"
   git branch -M main
   git remote add origin https://github.com/<ton-utilisateur>/portfolio.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : Deploy from a branch → main / (root)** → Save
4. Attends 1-2 minutes, ton site sera en ligne sur :
   `https://<ton-utilisateur>.github.io/portfolio/`

## Ajouter des images

Place les fichiers dans le dossier correspondant (`LOGO/`, `BANDEROLE/`, `Flyers/`),
puis ajoute un bloc dans la galerie de `index.html` :

```html
<div class="gallery-item" data-category="flyer">
  <div class="gallery-item__inner">
    <img src="Flyers/mon-image.jpeg" alt="Flyer" loading="lazy" />
    <div class="gallery-item__overlay">
      <span class="item-cat">Flyer</span>
      <h3>Titre du projet</h3>
      <button class="item-zoom" aria-label="Agrandir">↗</button>
    </div>
  </div>
</div>
```

## Personnaliser

- **Email / WhatsApp** : section contact dans `index.html`
- **Couleurs** : variables `--accent` etc. en haut de `style.css`
- **Stats** : attributs `data-target` dans la section stats
