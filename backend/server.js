require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./database/db');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Inicializar o banco de dados
  await db.initDB();
});
