# LAB*201 Event Album Website

## Projet
Site événementiel Français pour la sortie de l'album `YAMOTO` de l'artiste `Makala`.

## Pages présentes
- `index.html` — page d'accueil
- `album.html` — présentation de l'album et tracklist
- `artiste.html` — présentation de l'artiste
- `tournee.html` — page tournée avec dates dynamiques
- `actualites.html` — page d'actualités
- `admin/index.html` — page de connexion admin
- `admin/dashboard.html` — interface d'administration des dates

## Technologies utilisées
- HTML5
- CSS3
- JavaScript moderne
- Supabase (front-end) pour gestion des dates de tournée
- Responsive design (présent dans la structure, à vérifier en pratique)

## Points couverts
- Hero section
- Album promotion
- Call-to-action
- Biographie et univers artiste
- Tracklist avec numérotation
- Tournée dynamique avec date, ville, pays, lieu et statut sold-out
- Liens sociaux vers Instagram, YouTube, Spotify, TikTok, X
- News / actualités sous forme de ticker
- Admin CRUD pour les dates de tournée

## Problèmes identifiés
- Page `contact` manquante
- Aucun `meta description` ni balises Open Graph
- Pages secondaires sans titres `<h1>` sémantiques
- Modal admin sans attributs ARIA
- Clé Supabase exposée dans `assets/js/supabase.js`
- Pages utilisant `admin/index.php` dans les liens, alors que le fichier est `admin/index.html`
- News/Blog : pas d'articles cliquables ni de navigation entre contenus
- Image de pochette dans `album.html` commentée

## Instructions de démarrage
1. Ouvrir le dossier `Lab-201` dans un navigateur ou serveur local.
2. Naviguer vers `index.html` pour voir la page d'accueil.
3. Accéder à `tournee.html` pour tester le chargement des dates via Supabase.
4. Pour l'administration, aller sur `admin/index.html` et se connecter.

## Recommandations pour l'amélioration
- Ajouter une page `contact`
- Ajouter des descriptions SEO et Open Graph
- Renforcer l'accessibilité et la structure sémantique
- Corriger les liens d'administration
- Transformer les actualités en vrai blog avec pages/articles
- Remplacer la clé publique Supabase par un backend sécurisé si possible
