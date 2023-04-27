import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { subMonths, endOfMonth, startOfMonth } from "date-fns";

export default function PieChart({ expenses }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Filtra as despesas para o mês selecionado
  const filteredExpenses = expenses.filter((item) => {
    const date = new Date(item.date);
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return date >= start && date <= end;
  });

  // Agrupa as despesas por tipo
  const groupedExpenses = filteredExpenses.reduce((acc, curr) => {
    const type = curr.type;
    const value = parseFloat(curr.value.replace(",", "."));

    if (!acc[type]) {
      acc[type] = 0;
    }

    acc[type] += value;

    return acc;
  }, {});

  const totalExpenses = filteredExpenses.reduce((acc, curr) => {
    const value = parseFloat(curr.value.replace(",", "."));
    return acc + value;
  }, 0);

  const percentExpenses = {};
  Object.entries(groupedExpenses).forEach(([type, value]) => {
    percentExpenses[type] = ((value / totalExpenses) * 100).toFixed(2);
  });

  const data = {
    labels: Object.keys(percentExpenses),
    datasets: [
      {
        data: Object.values(percentExpenses),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center ml-16">
      <h2 className="text-xl font-bold mb-2">% De Gasto</h2>
      <div className="flex items-center">
        <label htmlFor="num-months-input" className="mr-2">
          Número de meses:
        </label>
        <input
          className="ml-4 text-center border rounded-md px-1 py-1"
          type="month"
          value={selectedMonth.toISOString().slice(0, 7)}
          onChange={(event) => setSelectedMonth(new Date(event.target.value))}
        />
      </div>
      <Pie data={data} width={350} />
    </div>
  );
}
