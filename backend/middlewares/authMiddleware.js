const jwt = require('jsonwebtoken');

const authMiddleware = (perfisPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'secret_key_app_scholar';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      req.usuario = decoded;

      if (perfisPermitidos.length > 0 && !perfisPermitidos.includes(req.usuario.perfil)) {
        return res.status(403).json({ error: 'Acesso negado. Perfil não autorizado.' });
      }

      next();
    });
  };
};

module.exports = authMiddleware;
