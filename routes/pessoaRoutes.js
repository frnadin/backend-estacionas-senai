import { Router } from 'express';
import pessoaController from '../controllers/pessoaController.js';

const router = Router();

// Criar uma nova pessoa
router.post('/pessoas', pessoaController.create);

// Obter todas as pessoas
router.get('/pessoas', pessoaController.getAll);

// Obter uma pessoa específica por ID
router.get('/pessoas/:id', pessoaController.getById);

// Atualizar uma pessoa pelo ID
router.put('/pessoas/:id', pessoaController.update);

// Deletar uma pessoa pelo ID
router.delete('/pessoas/:id', pessoaController.delete);

export default router;
