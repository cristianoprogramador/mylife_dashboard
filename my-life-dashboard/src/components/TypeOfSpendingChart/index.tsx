import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { format, startOfMonth, subMonths } from "date-fns";
import { useState } from "react";

function formatMonthYear(date: any) {
  return format(new Date(date), "MMM yy");
}

export default function MonthlySpendingChart({ expenses }: any) {
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

  const currentMonthExpenses = groupedExpenses[formatMonthYear(new Date())];

  const previousMonth = subMonths(new Date(), 1);
  const previousMonthExpenses = groupedExpenses[formatMonthYear(previousMonth)];

  const twoMonthsAgo = subMonths(new Date(), 2);
  const twoMonthsAgoExpenses = groupedExpenses[formatMonthYear(twoMonthsAgo)];

  const expensesByMonth = Object.values(groupedExpenses).slice(-numMonths);

  const data = {
    labels: expenses
      .filter((item, index, array) => {
        return array.findIndex((t) => t.type === item.type) === index;
      })
      .map((item: any) => item.type),
    datasets: [
      {
        label: "2 Meses atrás",
        backgroundColor: "rgba(17, 88, 221, 0.2)",
        borderColor: "#6366ff",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(122, 99, 255, 0.4)",
        hoverBorderColor: "#6d63ff",
        data: expensesByMonth.map((item: any) => item.value.toFixed(2)),
      },
      {
        label: "Mes Anterior",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: expensesByMonth.map((item: any) => item.value.toFixed(2)),
      },
      {
        label: "Mês Atual",
        backgroundColor: "rgba(7, 207, 17, 0.2)",
        borderColor: "#36cc11",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(23, 185, 8, 0.4)",
        hoverBorderColor: "#34c707",
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

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Gasto Total x Mês a Mês</h2>
      <div className=" max-w-screen-md">
        <Bar data={data} options={options} height={300} width={600} />
      </div>
    </div>
  );
}
