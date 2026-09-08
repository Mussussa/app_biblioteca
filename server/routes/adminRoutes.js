const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { autenticarToken, autorizarPerfis } = require('../middlewares/auth');

// Aplica autenticação e restrição de Admin a TODAS as rotas deste ficheiro
router.use(autenticarToken, autorizarPerfis('admin'));

// Faculdades e Cursos
router.post('/faculdades', AdminController.criarFaculdade);
router.get('/faculdades', AdminController.listarFaculdades);
router.post('/cursos', AdminController.criarCurso);
router.get('/cursos', AdminController.listarCursos);

// Categorias e Editoras
router.post('/categorias', AdminController.criarCategoria);
router.post('/editoras', AdminController.criarEditora);

// Gestão de Utilizadores
router.get('/utilizadores', AdminController.listarUtilizadores);
router.put('/utilizadores/:id', AdminController.atualizarUtilizador);
router.delete('/utilizadores/:id', AdminController.eliminarUtilizador);

module.exports = router;