import { Router } from 'express';
import pessoaController from '../controllers/pessoaController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = Router();

// Criar uma nova pessoa 
router.post('/pessoas', pessoaController.create);

// Rotas protegidas
router.get('/pessoas', auth, authorize('administrador', 'funcionario'), pessoaController.getAll);
router.get('/pessoas/:id', auth, authorize('administrador', 'funcionario'), pessoaController.getById);
router.put('/pessoas/:id', auth, authorize('administrador', 'funcionario'), pessoaController.update);

// Deletar uma pessoa só ademiro
router.delete('/pessoas/:id', auth, authorize('administrador'), pessoaController.delete);

export default router;
