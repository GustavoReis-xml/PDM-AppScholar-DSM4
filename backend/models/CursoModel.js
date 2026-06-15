const db = require('../database/db');

class CursoModel {
  static async criar(dados) {
    const { nome, area, duracao, coordenador } = dados;
    const query = `
      INSERT INTO cursos (nome, area, duracao, coordenador)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await db.query(query, [nome, area, duracao, coordenador]);
    return res.rows[0];
  }

  static async listar() {
    const res = await db.query('SELECT * FROM cursos ORDER BY nome ASC');
    return res.rows;
  }

  static async buscarPorId(id) {
    const res = await db.query('SELECT * FROM cursos WHERE id = $1', [id]);
    return res.rows[0];
  }

  static async atualizar(id, dados) {
    const { nome, area, duracao, coordenador } = dados;
    const query = `
      UPDATE cursos 
      SET nome = $1, area = $2, duracao = $3, coordenador = $4
      WHERE id = $5 RETURNING *;
    `;
    const res = await db.query(query, [nome, area, duracao, coordenador, id]);
    return res.rows[0];
  }

  static async deletar(id) {
    const res = await db.query('DELETE FROM cursos WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
}

module.exports = CursoModel;