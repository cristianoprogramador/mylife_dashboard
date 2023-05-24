import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { format, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";
import ptBR from "date-fns/locale/pt-BR";

function formatMonthYear(date: any) {
  return format(new Date(date), "MMM yy", { locale: ptBR }).replace(
    /^\w/,
    (c) => c.toUpperCase()
  );
}
export default function MonthlySpendingChart({ expenses, isSmallScreen }: any) {
  const [numMonths, setNumMonths] = useState(8);

  const filteredExpenses = expenses.filter((item: any) => {
    const date = new Date(item.date);
    const minDate = subMonths(new Date(), numMonths);
    return date >= minDate;
  });

  const groupedExpenses = filteredExpenses.reduce((acc: any, curr: any) => {
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
    labels: expensesByMonth.map((item: any) => item.monthYear),
    datasets: [
      {
        label: "Gastos",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: expensesByMonth.map((item: any) => item.value.toFixed(2)),
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
      <Line
        data={data}
        options={options}
        height={0}
        width={0}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.815)",
          color: "white",
          borderRadius: "5px",
          height: isSmallScreen ? "150px" : "300px",
          width: isSmallScreen ? "300px" : "600px",
        }}
      />
    </div>
  );
}
