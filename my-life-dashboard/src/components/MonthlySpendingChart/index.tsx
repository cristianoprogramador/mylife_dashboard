import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { format, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";

function formatMonthYear(date) {
  return format(new Date(date), "MMM yy");
}

export default function MonthlySpendingChart({ expenses }) {
  const [numMonths, setNumMonths] = useState(8);

  const filteredExpenses = expenses.filter((item) => {
    const date = new Date(item.date);
    const minDate = subMonths(new Date(), numMonths);
    return date >= minDate;
  });

  const groupedExpenses = filteredExpenses.reduce((acc, curr) => {
    const monthYear = formatMonthYear(curr.date);
    const value = parseFloat(curr.value.replace(",", ".")); // converte a string para número

    if (!acc[monthYear]) {
      acc[monthYear] = { monthYear, value };
    } else {
      acc[monthYear].value += value;
    }

    return acc;
  }, {});

  // console.log("OQ NAO TA INDO PRA EXIBI", filteredExpenses);
  // console.log("OQ TA INDO PRA EXIBI", Object.values(groupedExpenses));

  const expensesByMonth = Object.values(groupedExpenses).slice(-numMonths);

  const data = {
    labels: expensesByMonth.map((item) => item.monthYear),
    datasets: [
      {
        label: "Gastos",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: expensesByMonth.map((item) => item.value.toFixed(2)),
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handleNumMonthsChange = (event) => {
    const numMonths = parseInt(event.target.value);
    if (numMonths >= 3 && numMonths <= 12) {
      setNumMonths(numMonths);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Gasto Total x Mês a Mês</h2>
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
        <Line data={data} options={options} height={300} width={600} />
      </div>
    </div>
  );
}
