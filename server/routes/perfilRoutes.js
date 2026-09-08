const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/PerfilController');
const { autenticarToken , autorizarPerfis } = require('../middlewares/auth');
router.use(autenticarToken, autorizarPerfis('docente', 'estudante'));
// ==========================================
// ROTAS DE PERFIL (Protegidas por Token)
// ==========================================
router.get('/', PerfilController.obterPerfil);
router.put('/', PerfilController.atualizarPerfil);
router.get('/emprestimos', PerfilController.listarMeusEmprestimos);
router.get('/reservas', PerfilController.listarMinhasReservas);

module.exports = router;