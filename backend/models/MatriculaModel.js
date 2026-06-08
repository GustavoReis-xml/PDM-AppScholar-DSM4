const db = require('../database/db');

class MatriculaModel {
  static async listarMatriculas(alunoId) {
    const query = `
      SELECT d.id, d.nome, d.curso, d.semestre, 
        CASE WHEN n.id IS NOT NULL THEN true ELSE false END as matriculado
      FROM disciplinas d
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      ORDER BY d.curso, d.semestre, d.nome ASC
    `;
    const res = await db.query(query, [alunoId]);
    return res.rows;
  }

  static async atualizarMatriculas(alunoId, disciplinasAtivas) {
    // 1. Busca todas as disciplinas atuais do aluno
    const resAtual = await db.query('SELECT disciplina_id, nota1, nota2 FROM notas WHERE aluno_id = $1', [alunoId]);
    const disciplinasAtuais = resAtual.rows.map(r => r.disciplina_id);

    // 2. Determina o que inserir e o que remover
    const paraInserir = disciplinasAtivas.filter(id => !disciplinasAtuais.includes(id));
    const paraRemover = disciplinasAtuais.filter(id => !disciplinasAtivas.includes(id));

    // 3. Remove os vínculos antigos (isso apaga as notas também!)
    if (paraRemover.length > 0) {
      const placeholders = paraRemover.map((_, i) => `$${i + 2}`).join(',');
      await db.query(`DELETE FROM notas WHERE aluno_id = $1 AND disciplina_id IN (${placeholders})`, [alunoId, ...paraRemover]);
    }

    // 4. Insere os novos vínculos com notas vazias
    if (paraInserir.length > 0) {
      const valores = paraInserir.map(id => `(${alunoId}, ${id})`).join(',');
      await db.query(`INSERT INTO notas (aluno_id, disciplina_id) VALUES ${valores}`);
    }

    return true;
  }
}

module.exports = MatriculaModel;
