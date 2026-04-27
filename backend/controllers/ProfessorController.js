const ProfessorModel = require('../models/ProfessorModel');

class ProfessorController {
  static async cadastrar(req, res) {
    try {
      const professor = await ProfessorModel.criar(req.body);
      res.status(201).json({ message: 'Professor cadastrado com sucesso', professor });
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Erro: E-mail já está em uso por outro professor.' });
      }
      res.status(500).json({ error: 'Erro ao cadastrar professor' });
    }
  }

  static async listar(req, res) {
    try {
      const professores = await ProfessorModel.listar();
      res.json(professores);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar professores' });
    }
  }

  static async deletar(req, res) {
    const { id } = req.params;
    try {
      const deletado = await ProfessorModel.deletar(id);
      if (!deletado) return res.status(404).json({ error: 'Professor não encontrado' });
      res.json({ success: true, message: 'Professor excluído com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir professor' });
    }
  }
}

module.exports = ProfessorController;
