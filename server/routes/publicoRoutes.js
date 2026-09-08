const express = require('express');
const router = express.Router();
const PublicoController = require('../controllers/PublicoController');
const { autenticarToken, autorizarPerfis } = require('../middlewares/auth');

// ==========================================
// ROTAS DE OBRAS E LIVROS (PÚBLICAS - Sem token)
// ==========================================
router.get('/obras', PublicoController.listarObras);
router.get('/obras/:id', PublicoController.obterObraPorId);
router.get('/obras/:obra_id/ficheiro', PublicoController.baixarFicheiroDigital);

// ==========================================
// ROTAS DE TRABALHOS ACADÉMICOS (PÚBLICAS - Sem token)
// ==========================================
router.get('/trabalhos', PublicoController.listarTrabalhosPublicos);

// ==========================================
// ROTAS DE SUPORTE A FILTROS (PÚBLICAS - Sem token)
// ==========================================
router.get('/filtros', PublicoController.listarFiltrosAuxiliares);

// ==========================================
// ROTA PROTEGIDA (Apenas estudantes autenticados podem reservar)
// ==========================================
router.post('/reservas', autenticarToken, autorizarPerfis('estudante'), PublicoController.criarReserva);

module.exports = router;