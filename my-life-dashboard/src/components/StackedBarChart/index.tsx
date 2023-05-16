import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

function formatMonthYear(date: any) {
  return format(new Date(date), "MMM yy", { locale: ptBR }).replace(
    /^\w/,
    (c) => c.toUpperCase()
  );
}
interface GroupedExpenses {
  [monthYear: string]: {
    [type: string]: number;
  };
}
interface ExpensesProps {
  card: string;
  date: string;
  description: string;
  email: string;
  id: number;
  obs: string;
  type: string;
  value: string;
}
[];

interface DataProps {
  expenses: ExpensesProps[];
}

export default function StackedBarChart({ expenses }: any) {
  // Define o estado inicial para o mês selecionado
  const [numMonths, setNumMonths] = useState(3);

  // Filtra as despesas para os últimos `numMonths` meses
  const minDate = startOfMonth(subMonths(new Date(), numMonths - 1));
  // console.log(minDate);
  const filteredExpenses = expenses.filter((item: any) => {
    const date = new Date(item.date);
    return date >= minDate;
  });

  // Agrupa as despesas por mês e por tipo
  const groupedExpenses: GroupedExpenses = filteredExpenses.reduce(
    (acc: any, curr: any) => {
      const date = new Date(curr.date);
      const monthYear = formatMonthYear(curr.date);
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
    {} as GroupedExpenses
  );

  // Extrai os meses e tipos únicos para criar as labels dos eixos X e legendas
  const months = Object.keys(groupedExpenses);
  const typesSet = new Set<string>();

  for (let month of months) {
    for (let type in groupedExpenses[month]) {
      typesSet.add(type);
    }
  }

  const types: string[] = Array.from(typesSet);

  // Define as cores para cada tipo de despesa
  const colors: string[] = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  const datasets: any[] = [];

  for (let type of types) {
    const data: number[] = [];

    for (let month of months) {
      data.push(groupedExpenses[month][type] || 0);
    }

    const color = colors[datasets.length % colors.length];

    const dataset = {
      label: type,
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
    };

    datasets.push(dataset);
  }

  // Define os dados do gráfico
  const data = {
    labels: months,
    datasets,
  };

  // Define as opções do gráfico
  const options = {
    title: {
      display: true,
      text: "Expenses by Month and Type",
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
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
    <div className="flex flex-col items-center ">
      <h2 className="text-xl font-bold mb-2">Comparativo de Gastos</h2>
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
      <Bar
        data={data}
        options={options}
        height={300}
        width={600}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.815)",
          color: "white",
          borderRadius: "5px",
        }}
      />
    </div>
  );
}
