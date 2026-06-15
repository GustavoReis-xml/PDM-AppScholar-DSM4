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
    console.log('Apagando notas antigas incoerentes...');
    await pool.query('DELETE FROM notas');

    // Mapear alunos e disciplinas pelos nomes para não depender do ID exato
    const aRes = await pool.query('SELECT id, nome FROM alunos');
    const alunos = {};
    aRes.rows.forEach(r => alunos[r.nome] = r.id);

    const dRes = await pool.query('SELECT id, nome FROM disciplinas');
    const disciplinas = {};
    dRes.rows.forEach(r => disciplinas[r.nome] = r.id);

    console.log('Inserindo novas matrículas e notas coerentes...');
    const insertQuery = `
      INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao) VALUES 
      ($1, $2, 7.0, 8.0, 7.5, 'Aprovado'),
      ($3, $4, 9.0, 9.5, 9.25, 'Aprovado'),
      ($5, $6, 8.5, 9.0, 8.75, 'Aprovado'),
      ($7, $8, 5.0, 6.0, 5.5, 'Reprovado'),
      ($9, $10, 10.0, 10.0, 10.0, 'Aprovado')
    `;
    
    // João (Cálculo I)
    // Maria (Mobile, Redes)
    // Padrão (Banco)
    // Pedro (Fundamentos)
    
    await pool.query(insertQuery, [
      alunos['João da Silva'], disciplinas['Cálculo I'],
      alunos['Maria Oliveira'], disciplinas['Programação Mobile I'],
      alunos['Maria Oliveira'], disciplinas['Redes de Computadores'],
      alunos['Aluno Padrão'], disciplinas['Banco de Dados'],
      alunos['Pedro Souza'], disciplinas['Fundamentos de TI']
    ]);

    console.log('Banco de notas recriado com sucesso!');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    pool.end();
  }
}

run();
