const CursoModel = require('../models/CursoModel');

class CursoController {
  static async cadastrar(req, res) {
    try {
      const curso = await CursoModel.criar(req.body);
      res.status(201).json({ message: 'Curso cadastrado com sucesso', curso });
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Já existe um curso com este nome.' });
      }
      res.status(500).json({ error: 'Erro ao cadastrar curso' });
    }
  }

  static async listar(req, res) {
    try {
      const cursos = await CursoModel.listar();
      res.json(cursos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar cursos' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const curso = await CursoModel.buscarPorId(req.params.id);
      if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
      res.json(curso);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar curso' });
    }
  }

  static async editar(req, res) {
    try {
      const curso = await CursoModel.atualizar(req.params.id, req.body);
      if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
      res.json({ message: 'Curso atualizado com sucesso', curso });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar curso' });
    }
  }

  static async deletar(req, res) {
    try {
      const deletado = await CursoModel.deletar(req.params.id);
      if (!deletado) return res.status(404).json({ error: 'Curso não encontrado' });
      res.json({ success: true, message: 'Curso excluído com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir curso' });
    }
  }
}

module.exports = CursoController;