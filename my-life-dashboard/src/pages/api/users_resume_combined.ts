import { NextApiHandler, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "./db";

const handler: NextApiHandler = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1]; // Extrai o token do cabeçalho de autorização

  if (!token) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "GET") {
    const email = req.query.email as string;

    try {
      const conn = await connection();

      const [initialFormData] = await conn
        .execute("SELECT * FROM user_resume WHERE email = ?", [email])
        .catch((error) => {
          console.error("Erro ao buscar dados de user_resume:", error);
          return [
            {
              today: 2200,
              investments: 35000,
              vencimento: 8,
              creditCardAvg: 500,
              stocksInvestiment: 350,
              stocksInvestimentAvg: 300,
              paycheck: 3500,
            },
          ];
        });

      const [expensesDataAll] = await conn
        .execute("SELECT * FROM user_resume_expenses WHERE email = ?", [email])
        .catch((error) => {
          console.error("Erro ao buscar dados de user_resume_expenses:", error);
          return [];
        });

      const [cardsDataAll] = await conn
        .execute("SELECT * FROM user_resume_cards WHERE email = ?", [email])
        .catch((error) => {
          console.error("Erro ao buscar dados de user_resume_cards:", error);
          return [];
        });

      const result = {
        resume: initialFormData,
        expenses: expensesDataAll,
        cards: cardsDataAll,
      };

      conn.end();

      res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      res.status(500).json({ message: "Erro ao buscar dados" });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
};

export default handler;
