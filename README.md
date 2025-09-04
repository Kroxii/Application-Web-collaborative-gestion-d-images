# Application-Web-collaborative-gestion-d-images


# Cahier des charges

## Objectif
Développer une application web permettant l’upload, le stockage, la visualisation de documents (texte, PDF, images), la gestion de signatures graphiques associées, ainsi que l’hébergement d’images sur Cloudinary.

## Fonctionnalités principales

### Feature 1 : Upload de documents
**Description :**
L’utilisateur peut uploader un fichier document (formats supportés : .txt, .pdf, .jpg, .png) via un formulaire web.

**Attendus :**
- Formulaire d’upload avec sélection de fichier et validation client (format, taille max 3 Mo).
- Upload du fichier vers le backend via une requête POST.
- Affichage du statut d’upload (succès/erreur) avec message clair.

**Bonus :**
- Drag & drop pour déposer les fichiers.
- Gestion côté client d’erreur pour fichiers trop volumineux (>3 Mo) avec message visible.


### Feature 1 bis / Feature 2 : Backend stockage local des fichiers
**Description :**
Le serveur reçoit les fichiers uploadés, les stocke localement, et maintient un catalogue des fichiers disponibles.

**Attendus :**
- Endpoint REST POST `/upload` pour réception des fichiers.
- Stockage dans un dossier `/uploads` avec noms uniques (timestamp + nom original).
- Endpoint GET `/files` pour récupérer la liste des fichiers uploadés avec métadonnées (nom, taille, type, url locale).
- Gestion des erreurs backend (format non supporté, taille trop grande, échec écriture).
- Validation des extensions et sécurité (éviter exécution de fichiers uploadés).

**Bonus :**
- Suppression automatique des fichiers vieux de plus d’1 jour.
- Endpoint DELETE `/files/:filename` pour suppression manuelle.


### Feature 2 : Intégration upload d’images vers Cloudinary
**Description :**
Les fichiers images uploadés sont automatiquement envoyés vers Cloudinary, les autres documents restent stockés localement.

**Attendus :**
- Backend détecte les images (jpg/png) et les transmet à Cloudinary via API upload.
- Stockage des URL Cloudinary dans le catalogue fichier pour récupération côté frontend.
- Réponse claire au frontend sur le type de stockage et l’URL.
- Gestion des erreurs Cloudinary (échec upload, clé API absente).

**Bonus :**
- Transformation Cloudinary (redimensionnement largeur max 800px).
- Upload multiple (batch) vers Cloudinary en une seule requête.
  

### Feature 3 : Gestion de signature graphique associée aux documents
**Description :**
L’utilisateur peut dessiner une signature sur un canvas, puis l’associer à un document uploadé.

**Attendus :**
- Interface frontend avec canvas pour dessiner la signature (souris et tactile).
- Bouton validation pour capturer l’image (base64) et l’envoyer au backend.
- Backend stocke la signature sous forme de fichier ou blob lié à un document (par identifiant ou nom de fichier).
- Endpoint GET `/files/:filename/signature` pour récupérer la signature associée.
- Affichage de la signature sur la page de visualisation du document.

**Remarque :**
L’intégration directe de la signature dans le PDF nécessite des outils supplémentaires et dépasse le cadre de ce projet.

**Stockage :**
Le fichier image de la signature est stocké dans un dossier `/signatures` à la racine du projet, nommé selon le fichier lié (ex : facture1.pdfsignature.png).

**Bonus :**
- Bouton "effacer" pour réinitialiser le canvas avant validation.
- Compression de l’image signature avant envoi pour réduire la taille.


Repo créé par Ludo, Marie-Isabel et Remi