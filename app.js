import express from "express";
import database from "./database.js";
import dotenv from "dotenv";
import cors from "cors";

import pessoaRoutes from "./routes/pessoaRoutes.js";
import veiculoRoutes from "./routes/veiculoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3331;

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [`http://localhost:${PORT}`];
      const allowed = allowedOrigins.includes(origin);
      allowed
        ? callback(null, true)
        : callback(new Error("Não permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(pessoaRoutes);
app.use(veiculoRoutes);

const start = async () => {
  try {
    await database
      .sync({ alter: true })
      .then(() => {
        console.log("Tabelas sincronizadas com o DB.");
      })
      .catch((err) => {
        console.error("Erro ao sync:", err);
      }); // Sync modelos
    console.log("Banco syncado");
    app.listen(PORT, () => console.log(`Subiu a pipa do vovô. port:${PORT}`));
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
};

start();
