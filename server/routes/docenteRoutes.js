const express = require('express');
const router = express.Router();
const DocenteController = require('../controllers/DocenteController');
const { autenticarToken, autorizarPerfis } = require('../middlewares/auth');

// Exemplo: Rotas acessíveis por docentes, estudantes e admins
router.use(autenticarToken, autorizarPerfis('docente', 'estudante', 'admin'));

router.get('/obras', DocenteController.listarObras);
router.get('/emprestimos/:utilizador_id', DocenteController.meusEmprestimos);
router.get('/reservas/:utilizador_id', DocenteController.minhasReservas);
router.post('/reservas', DocenteController.criarReserva);
router.put('/emprestimos/:id/renovar', DocenteController.renovarEmprestimo);

module.exports = router;