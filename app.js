import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import pessoaRoutes from "./routes/pessoaRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import registroRoutes from "./routes/registroRoutes.js";
import permissaoRoutes from "./routes/permissaoRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [`http://localhost:5173`];
      const allowed = allowedOrigins.includes(origin);
      allowed
        ? callback(null, true)
        : callback(new Error("Não permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(authRoutes);
app.use(pessoaRoutes);
app.use(veiculoRoutes);
app.use(registroRoutes);
app.use(permissaoRoutes);

export default app; // exporta só o app, sem chamar sync nem listen
