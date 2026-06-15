const AlunoModel = require('../models/AlunoModel');

class AlunoController {
  static async cadastrar(req, res) {
    try {
      const aluno = await AlunoModel.criar(req.body);
      res.status(201).json({ message: 'Aluno cadastrado com sucesso', aluno });
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Erro: E-mail ou matrícula já estão em uso por outro aluno.' });
      }
      res.status(500).json({ error: 'Erro ao cadastrar aluno' });
    }
  }

  static async listar(req, res) {
    try {
      const usuario = req.usuario;
      let alunos;
      if (usuario.perfil === 'professor') {
        alunos = await AlunoModel.listarPorProfessor(usuario.id);
      } else {
        alunos = await AlunoModel.listar();
      }
      res.json(alunos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar alunos' });
    }
  }

  static async editar(req, res) {
    const { id } = req.params;
    const { nome, matricula, curso, telefone, cep, rua, numero, bairro, cidade, estado, semestre } = req.body;
    try {
      // Ignora email e senha para não complicar a edição básica agora
      const query = `
        UPDATE alunos 
        SET nome = $1, matricula = $2, curso = $3, telefone = $4, cep = $5, rua = $6, numero = $7, bairro = $8, cidade = $9, estado = $10, semestre = $11
        WHERE id = $12
      `;
      await db.query(query, [nome, matricula, curso, telefone, cep, rua, numero, bairro, cidade, estado, semestre, id]);
      res.json({ message: 'Aluno atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
  }

  static async deletar(req, res) {
    const { id } = req.params;
    try {
      const deletado = await AlunoModel.deletar(id);
      if (!deletado) return res.status(404).json({ error: 'Aluno não encontrado' });
      res.json({ success: true, message: 'Aluno excluído com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao excluir aluno' });
    }
  }

  static async boletim(req, res) {
    const { matricula } = req.params;
    try {
      const boletim = await AlunoModel.buscarBoletim(matricula);
      if (!boletim) {
        return res.status(404).json({ error: 'Boletim não encontrado para a matrícula informada' });
      }
      res.json(boletim);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar boletim' });
    }
  }
}

module.exports = AlunoController;
