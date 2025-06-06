import { Router } from 'express';
import veiculoController from '../controllers/veiculoController.js';

const router = Router()

// Criar um veiculo
router.post('/veiculos', veiculoController.create);

// Todos veiculos
router.get('/veiculos', veiculoController.getAll);

// Obter um veiculo  por ID
router.get('/veiculos/:id', veiculoController.getById);

// Atualiza pelo ID
router.put('/veiculos/:id', veiculoController.update);

// Deleta pelo ID
router.delete('/veiculos/:id', veiculoController.delete);


export default router