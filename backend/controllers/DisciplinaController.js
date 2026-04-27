const DisciplinaModel = require('../models/DisciplinaModel');

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

  static async deletar(req, res) {
    const { id } = req.params;
    try {
      const deletado = await DisciplinaModel.deletar(id);
      if (!deletado) return res.status(404).json({ error: 'Disciplina não encontrada' });
      res.json({ success: true, message: 'Disciplina excluída com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir disciplina' });
    }
  }
}

module.exports = DisciplinaController;
