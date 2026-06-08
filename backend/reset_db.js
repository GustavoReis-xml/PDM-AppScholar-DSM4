require('dotenv').config();
const { Pool } = require('pg');
const { initDB } = require('./database/db');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    console.log('Apagando todas as tabelas...');
    await pool.query(`
      DROP TABLE IF EXISTS notas CASCADE;
      DROP TABLE IF EXISTS disciplinas CASCADE;
      DROP TABLE IF EXISTS professores CASCADE;
      DROP TABLE IF EXISTS alunos CASCADE;
      DROP TABLE IF EXISTS admins CASCADE;
    `);
    console.log('Tabelas apagadas. Recriando e populando o banco de dados...');
    await initDB();
    console.log('Banco resetado com sucesso!');
  } catch (err) {
    console.error('Erro ao resetar banco:', err);
  } finally {
    pool.end();
  }
}

run();
