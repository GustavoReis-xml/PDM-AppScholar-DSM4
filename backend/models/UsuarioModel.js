const db = require('../database/db');

class UsuarioModel {
  static async buscarPorEmail(email) {
    // Busca em admins
    let resAdmin = await db.query('SELECT *, \'admin\' as perfil FROM admins WHERE email = $1', [email]);
    if (resAdmin.rows.length > 0) return resAdmin.rows[0];

    // Busca em alunos
    let res = await db.query('SELECT *, \'aluno\' as perfil FROM alunos WHERE email = $1', [email]);
    if (res.rows.length > 0) return res.rows[0];

    // Busca em professores se não achou em aluno
    res = await db.query('SELECT *, \'professor\' as perfil FROM professores WHERE email = $1', [email]);
    if (res.rows.length > 0) return res.rows[0];

    return null;
  }
}

module.exports = UsuarioModel;
