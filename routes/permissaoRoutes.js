import { Router } from "express";  
import permissaoController from "../controllers/permissaoController.js";

const router = Router();

router.post('/permissoes', permissaoController.create)

export default router