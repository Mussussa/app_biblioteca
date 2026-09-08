const jwt = require('jsonwebtoken');

// Verificação da validade do Token JWT
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do formato "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_super_segura');
    req.utilizador = decoded; // Guarda os dados descodificados { id, perfil } na requisição
    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};

// Verificação do perfil / permissão de acesso
const autorizarPerfis = (...perfisPermitidos) => {
  return (req, res, next) => {
    if (!req.utilizador || !perfisPermitidos.includes(req.utilizador.perfil)) {
      return res.status(403).json({ 
        erro: `Acesso negado. O seu perfil (${req.utilizador?.perfil || 'desconhecido'}) não tem permissão para aceder a esta rota.` 
      });
    }
    next();
  };
};

module.exports = { autenticarToken, autorizarPerfis };