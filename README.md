# Sonova-POC-front

Ce projet Node.js fournit une version autonome de la page de test d'upload de dossiers avec gestion des chunks et E2EE.

## Installation

Aucune dépendance n'est nécessaire. Il suffit de cloner le dépôt.

## Démarrage

```bash
npm start
```

Le serveur HTTP intégré démarre sur `http://localhost:3000` (modifiable via la variable d'environnement `PORT`).

## Fonctionnalités

- Interface web identique à la page fournie (gestion des projets, teams et uploads).
- Support des uploads de dossiers avec découpage en chunks et reprise.
- Fonctions de chiffrement de bout en bout (E2EE) basées sur libsodium côté client.
- Comparaison de l'arborescence locale vs distante avec calcul de hash SHA-256 côté navigateur.
- Logs détaillés et visualisation de la progression des fichiers.

Le serveur Node sert simplement les fichiers statiques présents dans `public/`.
