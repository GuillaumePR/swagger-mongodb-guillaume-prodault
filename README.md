# Express x MongoDB connexion

## Description

Rendu du cours de NodeJS/MongoDB

## Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (installé avec Node.js)

## Installation

1. Cloner le dépôt :
   ```sh
   git clone https://github.com/GuillaumePR/swagger-mongodb-guillaume-prodault.git
   ```
2. Se déplacer dans le dossier du projet :
   ```sh
   cd votre-projet
   ```
3. Installer les dépendances :
   ```sh
   npm install
   ```

## Utilisation

Lancer le projet en mode développement :

```sh
npm run dev
```

## Composants pertinents

Dossiers :

- `./models` : Contient les modèles de données en base MongoDB

- `./routes` : Contient les routes Express

Fichiers :

- `server.js` : Fichier Express principal
- `auth.js` : Fichier contenant la fonciton d'authentification

- `auth.routes.js` : Contient les toutes les routes pour les fonctions d'authentification vie API
- `potions.routes.js` : Contient les toutes les routes pour la gestions des potions en base

- `potion.model.js` : Contient le modèle en base MongoDB correspondant à l'objet Potion
- `user.model.js` : Contient le modèle en base MongoDB correspondant à l'objet User, utilisé pour l'authentificaiton

#

Rendu par Guillaume PRODAULT

ESGI 4 - AL
