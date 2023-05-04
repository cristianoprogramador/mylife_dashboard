import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface Goal {
  objetivo: string;
  mes: string;
  ano: string;
  valor: string;
}

export default function Goals() {
  const [objectivesData, setObjectivesData] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState("");
  const [addObjectiveClicked, setAddObjectiveClicked] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2023);
  const { data: session } = useSession();

  useEffect(() => {
    setObjectives([]);
  }, [selectedYear]);

  const filteredMonths = selectedYear
    ? months
        .map((month) => {
          // console.log(month);
          return `${month}/${selectedYear}`;
        })
        .filter((month) => {
          const [_, year] = month.split("/");
          const result = Number(year) === selectedYear;
          // console.log(`month: ${month}, year: ${year}, result: ${result}`);
          return result;
        })
    : [];

  console.log(objectivesData);

  const handleInputChange = (e, month, objective) => {
    const newObjectivesData = { ...objectivesData };
    if (!newObjectivesData[month]) {
      newObjectivesData[month] = {};
    }
    newObjectivesData[month][objective] = e.target.value;
    setObjectivesData(newObjectivesData);
  };

  const handleAddObjectiveClick = () => {
    setAddObjectiveClicked(true);
    setObjectives((prevObjectives) => [...prevObjectives, newObjective]);
    setNewObjective("");
  };

  const handleNewObjectiveChange = (e) => {
    setNewObjective(e.target.value);
  };

  const handleYearButtonClick = (year) => {
    setSelectedYear(year);
  };

  const saveToServer = async () => {
    const data = new URLSearchParams();
    const goals: Goal[] = [];

    Object.keys(objectivesData).forEach((monthYear) => {
      const [month, year] = monthYear.split("/");
      const { teste } = objectivesData[monthYear];
      goals.push({ objetivo: "teste", mes: month, ano: year, valor: teste });
    });

    data.append("goals", JSON.stringify(goals));
    data.append("email", session?.user?.email);

    console.log(JSON.stringify(goals));

    try {
      const response = await fetch(
        `/api/users_goals?email=${session?.user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Head>
        <title>Objetivos Mensais</title>
      </Head>
      <select
        className="px-4 py-2 text-center border rounded"
        value={selectedYear}
        onChange={(event) => handleYearButtonClick(Number(event.target.value))}
      >
        <option value="">Selecione um ano</option>
        {[2023, 2024, 2025].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {selectedYear && (
        <div className="flex space-x-4 flex-col">
          <div className="font-bold text-lg mb-2 text-center ">
            Crie um objetivo para acompanhar
          </div>
          <textarea
            className="flex-1 p-2 border rounded"
            rows={3}
            placeholder="Digite seu objetivo"
            value={newObjective}
            onChange={handleNewObjectiveChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddObjectiveClick}
          >
            Adicionar
          </button>
          <button
            onClick={saveToServer}
            className="px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
          >
            Salvar no Servidor
          </button>
        </div>
      )}
      {selectedYear && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border-gray-400 rounded-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Detalhe suas ações</th>
                  {objectives.map((obj) => (
                    <th className="px-4 py-2" key={obj}>
                      {obj}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMonths.map((month, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-center">
                      {month}
                    </td>
                    {objectives.map((obj) => (
                      <td
                        key={`${month}_${obj}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <textarea
                          rows={2}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          value={objectivesData[month]?.[obj] || ""}
                          onChange={(e) => handleInputChange(e, month, obj)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // console.log("CADE A SESSION", session);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
