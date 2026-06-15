const db = require('../database/db');

class AlunoModel {
  static async criar(dados) {
    const { nome, matricula, curso, email, senha, telefone, cep, rua, numero, bairro, cidade, estado, semestre } = dados;
    const query = `
      INSERT INTO alunos (nome, matricula, curso, email, senha, telefone, cep, rua, numero, bairro, cidade, estado, semestre)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [nome, matricula, curso, email, senha, telefone, cep, rua, numero, bairro, cidade, estado, semestre];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  static async listar() {
    const res = await db.query('SELECT id, nome, matricula, curso, email, semestre FROM alunos ORDER BY nome ASC');
    return res.rows;
  }

  static async listarPorProfessor(professorId) {
    const query = `
      SELECT DISTINCT a.id, a.nome, a.matricula, a.curso, a.email, a.semestre
      FROM alunos a
      JOIN notas n ON a.id = n.aluno_id
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE d.professor_id = $1
      ORDER BY a.nome ASC
    `;
    const res = await db.query(query, [professorId]);
    return res.rows;
  }

  static async deletar(id) {
    const res = await db.query('DELETE FROM alunos WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }

  static async buscarBoletim(matricula) {
    // 1. Busca os dados do aluno
    const alunoRes = await db.query('SELECT id, nome, matricula, curso FROM alunos WHERE matricula = $1', [matricula]);
    if (alunoRes.rows.length === 0) return null;
    
    const aluno = alunoRes.rows[0];

    // 2. Busca as notas e disciplinas associadas ao aluno usando JOIN
    const queryNotas = `
      SELECT d.nome as disciplina, n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = $1
    `;
    const notasRes = await db.query(queryNotas, [aluno.id]);

    return {
      nome: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      disciplinas: notasRes.rows
    };
  }
}

module.exports = AlunoModel;
