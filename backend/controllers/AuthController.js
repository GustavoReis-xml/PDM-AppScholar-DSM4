const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/UsuarioModel');

class AuthController {
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      // Comparação simples de senha (em produção usar bcrypt)
      if (usuario.senha !== senha) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Gerar token
      const secret = process.env.JWT_SECRET || 'secret_key_app_scholar';
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
        secret,
        { expiresIn: '1d' }
      );

      // Remover a senha por segurança antes de enviar para o Frontend
      const { senha: _, ...usuarioData } = usuario;

      res.json({
        token,
        usuario: usuarioData
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  static async resetPassword(req, res) {
    const { email, nova_senha } = req.body;
    try {
      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(404).json({ error: 'E-mail não encontrado no sistema.' });
      }

      const tabela = usuario.perfil === 'admin' ? 'admins' : usuario.perfil === 'aluno' ? 'alunos' : 'professores';
      
      const db = require('../database/db');
      await db.query(`UPDATE ${tabela} SET senha = $1 WHERE email = $2`, [nova_senha, email]);

      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao redefinir a senha' });
    }
  }
  static async updatePassword(req, res) {
    const { nova_senha } = req.body;
    const { id, perfil } = req.usuario;

    try {
      const tabela = perfil === 'admin' ? 'admins' : perfil === 'aluno' ? 'alunos' : 'professores';
      const db = require('../database/db');
      await db.query(`UPDATE ${tabela} SET senha = $1 WHERE id = $2`, [nova_senha, id]);

      res.json({ success: true, message: 'Senha alterada com sucesso!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao alterar a senha' });
    }
  }
}

module.exports = AuthController;
