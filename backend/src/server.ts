const express = require("express");
const app = express();

app.get("/api/example", (req: any, res: any) => {
  res.json({ message: "Exemplo de rota no backend" });
});

app.listen(3030, () => {
  console.log("Servidor backend rodando na porta 3030");
});
