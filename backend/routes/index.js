const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const AlunoController = require('../controllers/AlunoController');
const ProfessorController = require('../controllers/ProfessorController');
const DisciplinaController = require('../controllers/DisciplinaController');
const NotaController = require('../controllers/NotaController');
const MatriculaController = require('../controllers/MatriculaController');
const CursoController = require('../controllers/CursoController');
const auth = require('../middlewares/authMiddleware');

// Autenticação
router.post('/login', AuthController.login);
router.put('/reset-password', AuthController.resetPassword);
router.put('/perfil/senha', auth(['admin', 'professor', 'aluno']), AuthController.updatePassword);

// Cadastros e Edições (Apenas Admin)
router.post('/alunos', auth(['admin']), AlunoController.cadastrar);
router.put('/alunos/:id', auth(['admin']), AlunoController.editar);

// Matrículas (Admin)
router.get('/matriculas/:alunoId', auth(['admin']), MatriculaController.listar);
router.post('/matriculas/:alunoId', auth(['admin']), MatriculaController.salvar);

router.post('/professores', auth(['admin']), ProfessorController.cadastrar);
router.put('/professores/:id', auth(['admin']), ProfessorController.editar);

router.post('/disciplinas', auth(['admin']), DisciplinaController.cadastrar);
router.put('/disciplinas/:id', auth(['admin']), DisciplinaController.editar);
router.delete('/disciplinas/:id', auth(['admin']), DisciplinaController.deletar);
router.get('/disciplinas/:id/alunos', auth(['admin', 'professor']), DisciplinaController.alunos);

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

// Cursos (CRUD completo)
router.post('/cursos', auth(['admin']), CursoController.cadastrar);
router.get('/cursos', auth(['admin', 'professor', 'aluno']), CursoController.listar);
router.get('/cursos/:id', auth(['admin']), CursoController.buscarPorId);
router.put('/cursos/:id', auth(['admin']), CursoController.editar);
router.delete('/cursos/:id', auth(['admin']), CursoController.deletar);

// Consulta de Boletim
router.get('/boletim/:matricula', auth(['admin', 'professor', 'aluno']), AlunoController.boletim);

module.exports = router;
