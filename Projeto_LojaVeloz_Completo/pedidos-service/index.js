const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'loja_veloz',
  port: 5432,
});

app.get('/pedidos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

app.post('/pedidos', async (req, res) => {
  const { produto, quantidade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pedidos (produto, quantidade) VALUES ($1, $2) RETURNING *',
      [produto, quantidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Pedidos Service is running' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Pedidos Service rodando na porta ${PORT}`);
});
