# 🚗 Team Covoiturage

Une application web de **covoiturage dédiée à la communauté de La Cité**, permettant aux étudiants et membres du personnel de proposer et réserver des trajets facilement.

---

## 📌 Description

**Team Covoiturage** est une plateforme moderne développée avec **Next.js** qui facilite le partage de trajets entre utilisateurs d’une même institution.

L’objectif est de :

* réduire les coûts de transport 💸
* favoriser l’entraide entre étudiants 🤝
* diminuer l’impact environnemental 🌱

---

## 🚀 Fonctionnalités

* 🔐 Authentification (connexion / inscription)
* 🏠 Tableau de bord utilisateur
* 🚘 Publication de trajets
* 🔍 Consultation des trajets disponibles
* 👤 Gestion des utilisateurs
* 📱 Interface responsive (adaptée mobile et desktop)

---

## 🛠️ Technologies utilisées

* **Frontend** :

  * Next.js (App Router)
  * React
  * TypeScript
  * Tailwind CSS

* **Outils** :

  * ESLint
  * PostCSS

---

## 📂 Structure du projet

```
team-covoiturage/
│── app/
│   ├── components/       # Composants réutilisables
│   ├── dashboard/        # Interface utilisateur principale
│   ├── login/            # Page de connexion
│   ├── register/         # Page d'inscription
│   ├── layout.tsx        # Layout global
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
│
│── public/               # Fichiers statiques
│── package.json          # Dépendances et scripts
│── tsconfig.json         # Configuration TypeScript
│── next.config.ts        # Configuration Next.js
```

---

## ⚙️ Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/OussamaABBOUT/team-covoiturage.git
cd team-covoiturage
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le projet en mode développement

```bash
npm run dev
```

### 4. Accéder à l’application

Ouvre ton navigateur à :

```
http://localhost:3000
```

---

## 📦 Scripts disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Build du projet
npm run start    # Lancer en production
npm run lint     # Vérifier le code
```

---

## 🔐 Configuration

Si ton projet utilise des variables d’environnement (API, base de données, etc.), crée un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

---

## 👨‍💻 Auteur

* **Oussama ABBOUT**
* **Hillal Mohamed jad**
* **Hammachin Rayane Lakhdar**
* Projet réalisé dans le cadre académique à *La Cité*

---

## 📄 Licence

Ce projet est à but éducatif.

---

## 💡 Améliorations futures

* 💬 Système de messagerie entre utilisateurs
* ⭐ Système de notation des conducteurs
* 📍 Intégration de Google Maps
* 🔔 Notifications en temps réel

---

## 🙌 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`feature/ma-feature`)
3. Commit tes changements
4. Push et ouvre une Pull Request

---



---

✨ Merci d’utiliser **CovoitGo* !
