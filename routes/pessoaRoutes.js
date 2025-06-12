import { Router } from 'express';
import pessoaController from '../controllers/pessoaController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = Router();

// Rotas protegidas
router.post('/pessoas', auth, authorize('administrador', 'funcionario'), pessoaController.create);
router.get('/pessoas', auth, authorize('administrador', 'funcionario'), pessoaController.getAll);
router.get('/pessoas/:id', auth, authorize('administrador', 'funcionario'), pessoaController.getById);
router.put('/pessoas/:id', auth, authorize('administrador', 'funcionario'), pessoaController.update);
router.delete('/pessoas/:id', auth, authorize('administrador', 'funcionario'), pessoaController.delete);

// Deletar uma pessoa só ademiro
router.delete('/pessoas/:id', auth, authorize('administrador'), pessoaController.delete);

export default router;
