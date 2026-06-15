require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    console.log('Atualizando cursos na tabela alunos...');
    await pool.query(`UPDATE alunos SET curso = 'Análise e Desenv. de Sistemas' WHERE curso = 'Análise de Sistemas'`);
    await pool.query(`UPDATE alunos SET curso = 'Desenv. de Software Multiplataforma' WHERE curso = 'Desenvolvimento de Software Multiplataforma'`);
    await pool.query(`UPDATE alunos SET curso = 'Gestão da Tecnologia da Informação' WHERE curso = 'Gestão de TI'`);
    
    console.log('Atualizando cursos na tabela disciplinas...');
    await pool.query(`UPDATE disciplinas SET curso = 'Análise e Desenv. de Sistemas' WHERE curso = 'Análise de Sistemas'`);
    await pool.query(`UPDATE disciplinas SET curso = 'Desenv. de Software Multiplataforma' WHERE curso = 'Desenvolvimento de Software Multiplataforma'`);
    await pool.query(`UPDATE disciplinas SET curso = 'Gestão da Tecnologia da Informação' WHERE curso = 'Gestão de TI'`);

    console.log('Sucesso! Banco de dados normalizado.');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    pool.end();
  }
}

run();
