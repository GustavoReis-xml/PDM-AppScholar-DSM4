const MatriculaModel = require('../models/MatriculaModel');

class MatriculaController {
  static async listar(req, res) {
    try {
      const { alunoId } = req.params;
      const disciplinas = await MatriculaModel.listarMatriculas(alunoId);
      res.json(disciplinas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar disciplinas e matrículas do aluno.' });
    }
  }

  static async salvar(req, res) {
    try {
      const { alunoId } = req.params;
      const { disciplinasAtivas } = req.body; // Array de IDs das disciplinas onde o aluno está matriculado
      
      await MatriculaModel.atualizarMatriculas(alunoId, disciplinasAtivas || []);
      res.json({ message: 'Matrículas atualizadas com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao salvar matrículas do aluno.' });
    }
  }
}

module.exports = MatriculaController;
