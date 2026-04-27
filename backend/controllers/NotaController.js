const NotaModel = require('../models/NotaModel');
const db = require('../database/db');

class NotaController {
  static async cadastrar(req, res) {
    const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
    const usuario = req.usuario;

    try {
      // Regra de Propriedade
      if (usuario.perfil === 'professor') {
        const resp = await db.query('SELECT professor_id FROM disciplinas WHERE id = $1', [disciplina_id]);
        if (resp.rows.length === 0) {
          return res.status(404).json({ error: 'Disciplina não encontrada' });
        }
        if (resp.rows[0].professor_id !== usuario.id) {
          return res.status(403).json({ error: 'Acesso Negado: Você não ministra esta disciplina.' });
        }
      }

      const nota = await NotaModel.lancarNota(aluno_id, disciplina_id, nota1, nota2);
      res.status(201).json({ success: true, nota });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao lançar nota' });
    }
  }
}

module.exports = NotaController;
