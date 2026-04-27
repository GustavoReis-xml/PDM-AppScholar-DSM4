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

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          perfil: usuario.perfil,
          matricula: usuario.matricula || null
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}

module.exports = AuthController;
