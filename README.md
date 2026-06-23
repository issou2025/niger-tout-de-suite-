# Niger Info Veille

**Niger Info Veille** est une plateforme statique moderne, rapide et responsive conçue pour centraliser de manière automatisée la veille informationnelle sur la République du Niger. Elle agrège les actualités, communiqués officiels, appels d'offres publics, bulletins météo et rapports de développement en un portail unique.

---

## 🚀 Objectifs du Projet

1.  **Statique et Léger** : Entièrement développé en HTML5, CSS3 moderne et JavaScript pur (ES6+), sans aucun framework (pas de React, Vue, Angular, jQuery, Bootstrap ni Tailwind).
2.  **Hébergement Gratuit** : Optimisé pour être hébergé à coût zéro sur **GitHub Pages**, **Netlify**, **Vercel** ou **Cloudflare Pages**.
3.  **Respect des Sources d'Origine** : Les articles complets ne sont jamais copiés. La plateforme affiche uniquement le titre, un résumé court indicatif de veille et un lien direct redirigeant vers l'article d'origine.
4.  **Automatisation CI/CD** : Un script de collecte en arrière-plan (Node.js) s'exécute de façon périodique via **GitHub Actions** pour mettre à jour les données de manière transparente.

---

## 📁 Structure du Projet

```text
/index.html                           # Page d'accueil et structure sémantique SEO
/manifest.webmanifest                 # Manifeste PWA pour installation mobile
/assets/css/style.css                 # Charte graphique (reset, thèmes, responsive, skeletons)
/assets/js/utils.js                   # Utilitaires (formattage de dates, presse-papiers, toasts)
/assets/js/theme.js                   # Logique du mode clair/sombre (avec persistance)
/assets/js/bookmarks.js               # Gestion des favoris de l'utilisateur (localStorage)
/assets/js/render.js                  # Fonctions de génération dynamique du DOM
/assets/js/search.js                  # Moteur de recherche instantanée et filtres croisés
/assets/js/app.js                     # Point d'entrée principal et orchestration
/assets/img/logo.svg                  # Logo vectoriel stylisé aux couleurs du Niger
/assets/img/placeholder-news.svg      # Image de substitution par défaut
/data/sources.json                    # Base de données des 40 sources surveillées
/data/news.json                       # Articles de veille agrégés (JSON local)
/scripts/package.json                 # Dépendances Node.js du collecteur
/scripts/collect-news.js              # Script d'extraction de données (Scraper)
/.github/workflows/update-news.yml    # Planificateur automatique GitHub Actions
/README.md                            # Documentation générale du projet
```

---

## 🛠️ Installation et Test en Local

### 1. Cloner le projet
Téléchargez ou clonez le code source sur votre machine locale.

### 2. Tester l'interface utilisateur
Le navigateur bloque l'accès direct aux fichiers JSON locaux par mesure de sécurité (CORS) s'ils sont ouverts par double-clic sur `index.html`. Il est donc recommandé d'utiliser un petit serveur local.

**Option A (Python) :**
Ouvrez votre terminal dans la racine du projet et lancez :
```bash
python -m http.server 8000
```
Puis ouvrez votre navigateur à l'adresse : [http://localhost:8000](http://localhost:8000)

**Option B (Node.js - HTTP Server) :**
```bash
npm install -g http-server
http-server -p 8000
```

---

## ⚙️ Tester le Collecteur Automatique

Le script de collecte va analyser les pages des sources actives répertoriées dans `data/sources.json` et mettre à jour `data/news.json`.

1. Allez dans le dossier des scripts :
   ```bash
   cd scripts
   ```
2. Installez la dépendance Cheerio :
   ```bash
   npm install
   ```
3. Exécutez le collecteur :
   ```bash
   npm run collect
   ```
Les nouvelles informations extraites seront automatiquement nettoyées, catégorisées et ajoutées au fichier `data/news.json`.

---

## 🌐 Déploiement en Production

### Hébergement sur GitHub Pages (Recommandé)
1. Créez un dépôt sur GitHub et poussez votre code.
2. Allez dans les **Settings** (Paramètres) du dépôt, section **Pages**.
3. Sous **Build and deployment**, sélectionnez la branche `main` et le dossier `/` (racine) comme source.
4. Cliquez sur **Save**. Votre site sera accessible sous quelques minutes.

*Pour que la collecte automatique fonctionne, veillez à activer le workflow GitHub Actions sous l'onglet **Actions** de votre dépôt GitHub. Le robot mettra automatiquement le site à jour toutes les heures.*

---

## 📋 Ajouter une nouvelle source

Pour ajouter un nouveau site à surveiller, éditez le fichier `data/sources.json` et ajoutez un objet à la liste en respectant ce format :

```json
{
  "id": "source-041",
  "name": "Nom de l'Organisme ou Média",
  "url": "https://www.exemple.ne",
  "category": "Gouvernement",
  "country": "Niger",
  "language": "fr",
  "status": "active",
  "lastChecked": "",
  "description": "Brève description de la source."
}
```

---

## ⚖️ Mentions Légales & Avertissement

**Avertissement juridique :**
*Niger Info Veille est un agrégateur de veille. Les titres, résumés et liens sont fournis pour faciliter l'accès à l'information publique. Les contenus complets restent la propriété intellectuelle exclusive de leurs éditeurs respectifs. Niger Info Veille ne copie pas et ne revendique aucun droit sur les articles référencés. Pour lire le détail d'une information ou vérifier sa validité, l'utilisateur doit systématiquement se référer au site de la source originale.*

---

## 🛡️ Règles d'Éthique de Collecte (Scraping)
- **User-Agent unique** : Le robot s'identifie clairement via la chaîne `NigerInfoVeilleBot/1.0`.
- **Délai de politesse** : Une pause de 1,5 seconde est observée entre les requêtes à chaque serveur pour éviter les surcharges.
- **Quantité limitée** : Un maximum de 10 articles est extrait par source à chaque itération.
- **Données textuelles** : Seuls les textes de liens de plus de 30 caractères sont analysés. Aucun contenu lourd n'est téléchargé.
