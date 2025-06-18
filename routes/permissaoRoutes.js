import { Router } from "express";
import permissaoController from "../controllers/permissaoController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = Router();

router.post(
  "/permissoes",
  auth,
  authorize("administrador", "funcionario"),
  permissaoController.create
);

export default router;
