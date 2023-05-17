import express from "express";
import { router } from "./routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: ".env.local" }); // Carrega as variáveis de ambiente do arquivo .env.local

const app = express();
app.use(cors());

app.use(express.json());
app.use(router);

const PORT = process.env.PORT; // Define uma porta padrão caso a variável PORT não esteja definida

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
});
