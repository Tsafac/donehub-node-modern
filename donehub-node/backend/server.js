const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_NAME || "donhub",
  port: 5432,
});

// 🔁 Fonction de retry pour la connexion à la base
const retry = async (fn, retries = 10, delay = 2000) => {
  while (retries > 0) {
    try {
      return await fn();
    } catch (err) {
      console.log("🔁 Base non dispo, tentative de reconnexion...");
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("❌ Impossible de se connecter à PostgreSQL.");
};

// 🔨 Création automatique de la table
(async () => {
  try {
    await retry(() =>
      pool.query(`
        CREATE TABLE IF NOT EXISTS task (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          done BOOLEAN DEFAULT FALSE
        )
      `)
    );
    console.log("✅ Table 'task' prête.");
  } catch (err) {
    console.error("❌ Erreur création table:", err);
  }
})();

// 📦 Routes API
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM task ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
  }
});

app.post("/tasks", async (req, res) => {
  const { content } = req.body;
  try {
    await pool.query("INSERT INTO task (content) VALUES ($1)", [content]);
    res.status(201).json({ message: "Tâche ajoutée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la tâche" });
  }
});

app.put("/tasks/:id/done", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("UPDATE task SET done = true WHERE id = $1", [id]);
    res.json({ message: "Tâche terminée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
  }
});

// 🚀 Démarrage du serveur
app.listen(3000, () => {
  console.log("✅ API en écoute sur http://localhost:3000");
});

app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM task WHERE id = $1", [id]);
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    console.error("❌ Erreur suppression :", err);
    res.status(500).json({ error: "Erreur suppression" });
  }
});
