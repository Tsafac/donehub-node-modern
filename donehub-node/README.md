# DoneHub Node.js (structure de base)

Application de gestion de tâches avec une API Node.js et une interface HTML moderne.

## 📁 Arborescence

```
donehub-node/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile          
├── frontend/
│   ├── index.html
│   ├── tasks.html
│   └── add_task.html
└── docker-compose.yml      
```

## 🔧 À faire par vous-même

- Complétez `Dockerfile` pour builder l'API Node.js
- Complétez `docker-compose.yml` pour lancer l'API et PostgreSQL
- Créez la table PostgreSQL `task` manuellement ou via script

## 🚀 Interaction

- Toutes les actions dans l'interface sont déclenchées **exclusivement par des boutons**
- Navigation fluide, moderne, responsive via Bootstrap

## ▶️ Pour démarrer

1. Complétez les fichiers Docker
2. Lancez `docker compose up --build`
3. Ouvrez `frontend/index.html` dans un navigateur
