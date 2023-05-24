import { data } from "autoprefixer";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "next-themes";

export function ForecastBalance({
  month,
  currentAccount,
  currentAccountAvg,
  investments,
  investmentsAvg,
  paycheck,
}: any) {
  const tableData = [];

  // Inicialize o totalPatrimony com a soma dos valores da conta corrente, investimentos e cripto
  // let totalPatrimony = currentAccount + investments;

  // console.log("MES VINDO", month);
  // console.log("Conta Corrente", currentAccount);
  // console.log("Salario Mensal", paycheck);
  // console.log("Média de Gastos", currentAccountAvg);
  // console.log("Total Investido", investments);
  // console.log("Média de Investmento", investmentsAvg);

  for (let i = 0; i < 8; i++) {
    const avgExpense = paycheck - currentAccountAvg;
    const avgInvestment = investmentsAvg;

    tableData.push({
      month: format(addMonths(new Date(month), i), "MMM '-' yyyy", {
        locale: ptBR,
      }),
      currentAccount: currentAccount,
      investments: investments,
      totalBalance: currentAccount + investments,
    });

    currentAccount += avgExpense;
    investments += avgInvestment;
  }

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-300 text-black" : "bg-blue-200";
  const bgColorTable = theme === "dark" ? "border text-white" : "bg-white";
  const bgColorHover =
    theme === "dark"
      ? "border-b border-gray-200 hover:bg-gray-400"
      : "border-b border-gray-200 hover:bg-blue-100";

  return (
    <>
      <div className="font-bold text-white text-lg text-center">
        Projeção baseado na Média
      </div>
      <div className={`${bgColorTable} shadow-md rounded overflow-x-auto`}>
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className={`${bgColor} text-xs leading-normal`}>
              <th className="py-2 px-2 text-center">Mês</th>
              <th className="py-2 px-2 text-center">Conta Corrente</th>
              <th className="py-2 px-2 text-center">Total Investido</th>
              <th className="py-2 px-2 text-center">Total Patrimônio</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {tableData.map((data) => (
              <tr
                className={` ${bgColorHover} md:text-sm text-xs`}
                key={data.month}
              >
                <td className="py-2 px-2 text-center ">{data.month}</td>
                <td className="py-2 px-2 text-center ">
                  R$:{" "}
                  {Number(data.currentAccount).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-2 text-center ">
                  R$:{" "}
                  {Number(data.investments).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-2 text-center ">
                  R$:{" "}
                  {Number(data.totalBalance).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
