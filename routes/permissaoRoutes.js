import { Router } from "express";
import permissaoController from "../controllers/permissaoController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = Router();

// Criar permissão
router.post(
  "/permissoes",
  auth,
  authorize("administrador", "funcionario"),
  permissaoController.create
);

// Listar todas as permissões
router.get(
  "/permissoes",
  auth,
  authorize("administrador", "funcionario"),
  permissaoController.getAll
);

// Buscar permissão por ID
router.get(
  "/permissoes/:id",
  auth,
  authorize("administrador", "funcionario"),
  permissaoController.getById
);

// Atualizar permissão
router.put(
  "/permissoes/:id",
  auth,
  authorize("administrador", "funcionario"),
  permissaoController.update
);

// Deletar permissão (somente administrador)
router.delete(
  "/permissoes/:id",
  auth,
  authorize("administrador"),
  permissaoController.delete
);

export default router;
