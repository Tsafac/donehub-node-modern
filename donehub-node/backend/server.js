const express = require('express');
const cors = require('cors');
const { Pool } = require('('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'mydb',
  port: 5432
});

app.get('/api/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM task ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/tasks', async (req, res) => {
  const { content } = req.body;
  await pool.query('INSERT INTO task (content, done) VALUES ($1, false)', [content]);
  res.json({ message: 'Tâche ajoutée' });
});

app.put('/api/tasks/:id/done', async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE task SET done = true WHERE id = $1', [id]);
  res.json({ message: 'Tâche mise à jour' });
});

app.listen(3000, () => {
  console.log('API en écoute sur http://localhost:3000');
});
