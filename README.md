# Le Chapelet

Site web pour réciter le chapelet (Rosaire) en français, inspiré de l'app Rosario.

## Fonctionnalités

- **Suggestion automatique des mystères** selon le jour de la semaine
  (Joyeux : lundi/samedi · Douloureux : mardi/vendredi · Glorieux : mercredi/dimanche · Lumineux : jeudi)
- **Guidage pas à pas** à travers toutes les prières du chapelet :
  signe de croix, Credo, Notre Père, Je vous salue Marie, Gloire au Père,
  prière de Fatima, Salve Regina.
- **Méditation des 20 mystères** avec leur fruit spirituel et un passage de l'Évangile.
- **Visualisation du chapelet** : chaque grain s'illumine au fil de la prière.
- **Interface contemplative** : design épuré, mode sombre automatique, navigation au clavier
  (← / → / Espace).

## Lancer le site

C'est un site statique sans dépendances. Ouvrez `index.html` ou servez-le :

```sh
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

- `index.html` — structure des trois écrans (accueil, prière, fin)
- `styles.css` — design contemplatif, responsive, mode sombre
- `data.js` — prières et 20 mystères du Rosaire en français
- `app.js` — navigation, génération de la séquence, progression des grains
