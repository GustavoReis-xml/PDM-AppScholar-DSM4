const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const AlunoController = require('../controllers/AlunoController');
const ProfessorController = require('../controllers/ProfessorController');
const DisciplinaController = require('../controllers/DisciplinaController');
const NotaController = require('../controllers/NotaController');
const auth = require('../middlewares/authMiddleware');

// Autenticação
router.post('/login', AuthController.login);

// Cadastros (Apenas Admin)
router.post('/alunos', auth(['admin']), AlunoController.cadastrar);
router.post('/professores', auth(['admin']), ProfessorController.cadastrar);
router.post('/disciplinas', auth(['admin']), DisciplinaController.cadastrar);

// Listagens
router.get('/alunos', auth(['admin', 'professor']), AlunoController.listar);
router.get('/professores', auth(['admin', 'professor']), ProfessorController.listar);
router.get('/disciplinas', auth(['admin', 'professor']), DisciplinaController.listar);
router.get('/disciplinas/professor/:id', auth(['admin', 'professor']), DisciplinaController.listarPorProfessor);

// Notas
router.post('/notas', auth(['admin', 'professor']), NotaController.cadastrar);

// Exclusão (Apenas Admin)
router.delete('/alunos/:id', auth(['admin']), AlunoController.deletar);
router.delete('/professores/:id', auth(['admin']), ProfessorController.deletar);
router.delete('/disciplinas/:id', auth(['admin']), DisciplinaController.deletar);

// Consulta de Boletim
router.get('/boletim/:matricula', auth(['admin', 'professor', 'aluno']), AlunoController.boletim);

module.exports = router;
