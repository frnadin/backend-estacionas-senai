import express from "express";
import registroController from "../controllers/registroController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Criar registro — só admins e funcionários
router.post(
  "/registros",
  auth,
  authorize("administrador", "funcionario"),
  registroController.create
);

// Listar todos os registros — só admins e funcionários
router.get(
  "/registros",
  auth,
  authorize("administrador", "funcionario"),
  registroController.getAll
);

// Listar registros por pessoa — só admins e funcionários
router.get(
  "/registros/pessoa/:pessoa_id",
  auth,
  authorize("administrador", "funcionario"),
  registroController.getByPessoa
);

// Listar registros por veículo — só admins e funcionários
router.get(
  "/registros/veiculo/:veiculo_id",
  auth,
  authorize("administrador", "funcionario"),
  registroController.getByVeiculo
);

// Puxar vagas disponíveis — all   
router.get(
  "/registros/vagas-disponiveis",
  auth,
  registroController.vagasDisponiveis
);

export default router;
