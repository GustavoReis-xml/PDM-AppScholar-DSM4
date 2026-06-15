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
    console.log('Atualizando semestres das disciplinas para alinhar com alunos...');
    // Cálculo I para João da Silva (2º Semestre)
    await pool.query(`UPDATE disciplinas SET semestre = '2º Semestre' WHERE nome = 'Cálculo I'`);
    // Programação Mobile I para Maria (3º Semestre)
    await pool.query(`UPDATE disciplinas SET semestre = '3º Semestre' WHERE nome = 'Programação Mobile I'`);
    // Banco de Dados para Aluno Padrão (1º Semestre)
    await pool.query(`UPDATE disciplinas SET semestre = '1º Semestre' WHERE nome = 'Banco de Dados'`);
    
    // Inserir disciplina para Pedro Souza se não existir (GTI 1º Semestre)
    const res = await pool.query(`SELECT id FROM disciplinas WHERE nome = 'Fundamentos de TI'`);
    if (res.rows.length === 0) {
       await pool.query(`INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) VALUES ('Fundamentos de TI', 40, 1, 'Gestão da Tecnologia da Informação', '1º Semestre')`);
    }

    console.log('Sucesso! Banco de dados alinhado aos semestres estritos.');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    pool.end();
  }
}

run();
