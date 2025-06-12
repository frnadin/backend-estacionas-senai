import { Router } from "express";
import veiculoController from "../controllers/veiculoController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
const router = Router();

// Criar um veiculo
router.post(
  "/veiculos",
  auth,
  authorize("administrador", "funcionario"),
  veiculoController.create
);

// Criar um veiculo vinculado ao usuário autenticado
router.post("/veiculos/meus", auth, veiculoController.createMine);

// Obter todos os veiculos do usuário autenticado
router.get(
  "/veiculos/meus",
  auth,
  authorize("aluno", "professor"),
  veiculoController.getMine
);

router.put(
  "/veiculos/meus/:id",
  auth,
  authorize("aluno", "professor"),
  veiculoController.updateMine
);

router.delete(
  "/veiculos/meus/:id",
  auth,
  authorize("aluno", "professor"),
  veiculoController.deleteMine
);

router.get(
  "/veiculos",
  auth,
  authorize("administrador", "funcionario"),
  veiculoController.getAll
);

// Obter um veiculo  por ID
router.get(
  "/veiculos/:id",
  auth,
  authorize("administrador", "funcionario"),
  veiculoController.getById
);

// Atualiza pelo ID
router.put(
  "/veiculos/:id",
  auth,
  authorize("administrador", "funcionario"),
  veiculoController.update
);

// Deleta pelo ID
router.delete(
  "/veiculos/:id",
  auth,
  authorize("administrador", "funcionario"),
  veiculoController.delete
);

export default router;
