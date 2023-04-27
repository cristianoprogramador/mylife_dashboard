import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";

type Expense = {
  id: number;
  type: string;
  value: string;
  date: string;
};

type GroupedExpenses = {
  [type: string]: {
    [month: string]: number;
  };
};

export default function MonthlySpendingChart({ expenses }: any) {
  const [numMonths, setNumMonths] = useState(3);

  // Filtra as despesas para os últimos `numMonths` meses
  const minDate = startOfMonth(subMonths(new Date(), numMonths - 1));
  // console.log(minDate);
  const filteredExpenses = expenses.filter((item) => {
    const date = new Date(item.date);
    return date >= minDate;
  });

  // Agrupa as despesas por tipo e mês
  const groupedExpensesByMonthAndType = filteredExpenses.reduce(
    (acc: GroupedExpenses, curr: Expense) => {
      const monthYear = format(new Date(curr.date), "MM/yyyy");
      const type = curr.type;
      const value = parseFloat(curr.value.replace(",", "."));

      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }

      if (!acc[monthYear][type]) {
        acc[monthYear][type] = 0;
      }

      acc[monthYear][type] += value;

      return acc;
    },
    {}
  );

  const labels = expenses
    .filter((item, index, array) => {
      return array.findIndex((t) => t.type === item.type) === index;
    })
    .map((item: any) => item.type);

  // Converte o objeto em um array com o formato esperado pelo Chart.js
  const dataByMonth = Object.keys(groupedExpensesByMonthAndType).reduce(
    (acc: any, monthYear: string) => {
      const typeValues = groupedExpensesByMonthAndType[monthYear];
      const data = [];

      // Percorre todos os tipos de despesa para o mês atual
      labels.forEach((type) => {
        const value = typeValues[type] || 0;
        data.push(value);
      });

      acc.push({
        label: monthYear,
        data,
      });

      return acc;
    },
    []
  );

  const data = {
    labels: labels,
    datasets: dataByMonth.map((monthData: any, index: number) => {
      const colors = [
        "rgba(255,99,132,0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(63, 131, 24, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ];
      const borderColor = [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "#068511",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ];
      return {
        label: monthData.label,
        backgroundColor: colors[index % colors.length],
        borderColor: borderColor[index % colors.length],
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: monthData.data,
      };
    }),
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    animation: {
      duration: 0,
    },
  };

  const handleNumMonthsChange = (event: any) => {
    const numMonths = parseInt(event.target.value);
    if (numMonths >= 3 && numMonths <= 12) {
      setNumMonths(numMonths);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Gasto por Tipo</h2>
      <div className="flex items-center">
        <label htmlFor="num-months-input" className="mr-2">
          Número de meses:
        </label>
        <input
          type="number"
          id="num-months-input"
          min="3"
          max="12"
          value={numMonths}
          onChange={handleNumMonthsChange}
          className="px-2 py-1 border rounded-md"
        />
      </div>
      <div className=" max-w-screen-md">
        <Bar data={data} options={options} height={300} width={600} />
      </div>
    </div>
  );
}
