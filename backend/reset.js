require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function reset() {
  await pool.query('DROP TABLE IF EXISTS notas, disciplinas, alunos, professores, admins CASCADE');
  console.log('Tabelas apagadas. Pode iniciar o servidor para recriar.');
  process.exit();
}

reset();
