const DisciplinaModel = require('../models/DisciplinaModel');
const db = require('../database/db');

class DisciplinaController {
  static async cadastrar(req, res) {
    try {
      const disciplina = await DisciplinaModel.criar(req.body);
      res.status(201).json({ message: 'Disciplina cadastrada com sucesso', disciplina });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar disciplina' });
    }
  }

  static async listar(req, res) {
    try {
      const disciplinas = await DisciplinaModel.listar();
      res.json(disciplinas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar disciplinas' });
    }
  }

  static async listarPorProfessor(req, res) {
    const { id } = req.params;
    try {
      const disciplinas = await DisciplinaModel.listarPorProfessor(id);
      res.json(disciplinas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar disciplinas do professor' });
    }
  }

  static async editar(req, res) {
    const { id } = req.params;
    const { nome, carga_horaria, professor_id, curso, semestre } = req.body;
    try {
      const query = `
        UPDATE disciplinas 
        SET nome = $1, carga_horaria = $2, professor_id = $3, curso = $4, semestre = $5
        WHERE id = $6
      `;
      await db.query(query, [nome, carga_horaria, professor_id || null, curso, semestre, id]);
      res.json({ message: 'Disciplina atualizada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar disciplina' });
    }
  }

  static async deletar(req, res) {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM disciplinas WHERE id = $1', [id]);
      res.json({ message: 'Disciplina excluída com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir disciplina' });
    }
  }

  static async alunos(req, res) {
    const { id } = req.params;
    try {
      const query = `
        SELECT a.id, a.nome, a.matricula, a.curso 
        FROM alunos a
        JOIN notas n ON a.id = n.aluno_id
        WHERE n.disciplina_id = $1
        ORDER BY a.nome ASC
      `;
      const result = await db.query(query, [id]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar alunos da disciplina' });
    }
  }
}

module.exports = DisciplinaController;
