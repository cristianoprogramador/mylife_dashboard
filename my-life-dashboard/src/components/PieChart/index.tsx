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

  console.log(filteredExpenses);

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

  console.log(groupedExpenses);

  const data = {
    labels: Object.keys(groupedExpenses),
    datasets: [
      {
        data: Object.values(groupedExpenses),
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
    <div>
      <div>
        <label>Select a month:</label>
        <input
          type="month"
          value={selectedMonth.toISOString().slice(0, 7)}
          onChange={(event) => setSelectedMonth(new Date(event.target.value))}
        />
      </div>
      <Pie data={data} width={400} />
    </div>
  );
}
