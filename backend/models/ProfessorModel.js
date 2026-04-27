const db = require('../database/db');

class ProfessorModel {
  static async criar(dados) {
    const { nome, titulacao, area, tempo_docencia, email, senha } = dados;
    const query = `
      INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, senha)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [nome, titulacao, area, tempo_docencia, email, senha];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  static async listar() {
    const res = await db.query('SELECT id, nome, titulacao, area, tempo_docencia, email FROM professores ORDER BY nome ASC');
    return res.rows;
  }

  static async deletar(id) {
    const res = await db.query('DELETE FROM professores WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
}

module.exports = ProfessorModel;
