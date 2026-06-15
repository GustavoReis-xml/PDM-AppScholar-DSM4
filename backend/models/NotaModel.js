const db = require('../database/db');

class NotaModel {
  static async lancarNota(aluno_id, disciplina_id, nota1, nota2) {
    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    const media = (n1 + n2) / 2;
    const situacao = media >= 6 ? 'Aprovado' : 'Reprovado';

    const query = `
      INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (aluno_id, disciplina_id) 
      DO UPDATE SET 
        nota1 = EXCLUDED.nota1,
        nota2 = EXCLUDED.nota2,
        media = EXCLUDED.media,
        situacao = EXCLUDED.situacao
      RETURNING *;
    `;
    const values = [aluno_id, disciplina_id, n1, n2, media, situacao];
    const res = await db.query(query, values);
    return res.rows[0];
  }
}

module.exports = NotaModel;
