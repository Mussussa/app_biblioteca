const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 

// Importação dos novos controladores divididos
const DashboardController = require('../controllers/DashboardController');
const EmprestimosController = require('../controllers/EmprestimosController');
const ReservasController = require('../controllers/ReservasController');
const ObrasController = require('../controllers/ObrasController');
const ExemplaresController = require('../controllers/ExemplaresController');
const TrabalhosController = require('../controllers/TrabalhosController');

const { autenticarToken, autorizarPerfis } = require('../middlewares/auth');

router.use(autenticarToken, autorizarPerfis('bibliotecario', 'admin'));

// Dashboard
router.get('/dashboard', DashboardController.dashboard);

// Empréstimos
router.get('/emprestimos', EmprestimosController.listarEmprestimos);
router.post('/emprestimos', EmprestimosController.registarEmprestimo);
router.delete('/emprestimos/:id', EmprestimosController.eliminarEmprestimo);

// Reservas
router.get('/reservas', ReservasController.listarReservas);
router.post('/reservas/:id/confirmar', ReservasController.confirmarReserva);
router.delete('/reservas/:id', ReservasController.eliminarReserva);

// Obras (Livros gerais) e Ficheiros
router.get('/obras', ObrasController.listarObras);
// Substitua:
// router.post('/obras', upload.single('capa'), ObrasController.registarObra);

// Por isto:
router.post('/obras', upload.fields([
  { name: 'capa', maxCount: 1 },
  { name: 'ficheiro', maxCount: 1 }
]), ObrasController.registarObra);
router.put('/obras/:id', ObrasController.editarObra);
router.delete('/obras/:id', ObrasController.eliminarObra);
router.post('/obras/:obra_id/upload', upload.single('ficheiro'), ObrasController.uploadFicheiroDigital);
router.get('/obras/:obra_id/ficheiro', ObrasController.obterFicheiroDigital);


// Exemplares Físicos
router.get('/exemplares', ExemplaresController.listarExemplares);
router.post('/exemplares', ExemplaresController.registarExemplar);
router.put('/exemplares/:id', ExemplaresController.editarExemplar);
router.delete('/exemplares/:id', ExemplaresController.eliminarExemplar);

// Trabalhos de Fim de Curso
router.get('/trabalhos', TrabalhosController.listarTrabalhos);
router.post('/trabalhos', upload.single('ficheiro'), TrabalhosController.registarTrabalho); 
router.put('/trabalhos/:id', TrabalhosController.editarTrabalho);
router.delete('/trabalhos/:id', TrabalhosController.eliminarTrabalho);

module.exports = router;