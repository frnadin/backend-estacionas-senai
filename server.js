import app from "./app.js";
import database from "./database.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3313;

const startServer = async () => {
  try {
    await database.sync({ alter: true });
    console.log("Banco syncado.");

    app.listen(PORT, () => {
      console.log(`Subiu a pipa do vovô ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao subir servidor:", error);
  }
};

startServer();
