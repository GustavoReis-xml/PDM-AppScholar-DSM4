const db = require('../database/db');

class DisciplinaModel {
  static async criar(dados) {
    const { nome, carga_horaria, professor_id, curso, semestre } = dados;
    const query = `
      INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nome, carga_horaria, professor_id, curso, semestre];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  static async listar() {
    const query = `
      SELECT d.id, d.nome, d.carga_horaria, d.curso, d.semestre, p.nome as professor_nome
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      ORDER BY d.nome ASC
    `;
    const res = await db.query(query);
    return res.rows;
  }

  static async listarPorProfessor(professorId) {
    const query = `
      SELECT d.id, d.nome, d.carga_horaria, d.curso, d.semestre
      FROM disciplinas d
      WHERE d.professor_id = $1
      ORDER BY d.nome ASC
    `;
    const res = await db.query(query, [professorId]);
    return res.rows;
  }

  static async deletar(id) {
    const res = await db.query('DELETE FROM disciplinas WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
}

module.exports = DisciplinaModel;
