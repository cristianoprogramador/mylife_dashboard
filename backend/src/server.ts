import express from "express";
import { router } from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Importe o módulo 'path' do Node.js

dotenv.config({ path: ".env.local" }); // Carrega as variáveis de ambiente do arquivo .env.local

const app = express();
app.use(cors());

app.use(express.json());
app.use(router);

const publicPath = path.resolve(__dirname, "../public");

app.use(express.static(publicPath));

const PORT = process.env.PORT; // Define uma porta padrão caso a variável PORT não esteja definida

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
});
