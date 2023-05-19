import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
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

type Goal = {
  objetivo: string;
  mes: string;
  ano: string;
  valor: string;
};

export default function Goals() {
  const [objectivesData, setObjectivesData] = useState<any>({});
  const [objectives, setObjectives] = useState<any[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [addObjectiveClicked, setAddObjectiveClicked] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2023);
  const { data: session } = useSession();

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

  const handleInputChange = (e: any, month: any, objective: any) => {
    const newObjectivesData = { ...objectivesData };
    console.log(newObjectivesData);
    if (!newObjectivesData[month]) {
      newObjectivesData[month] = {};
    }
    newObjectivesData[month][objective] = e.target.value;
    setObjectivesData(newObjectivesData);
  };

  const handleAddObjectiveClick = () => {
    if (newObjective.trim() !== "") {
      // verifique se o valor do input não é vazio depois de remover espaços em branco
      setAddObjectiveClicked(true);
      setObjectives((prevObjectives) => [...prevObjectives, newObjective]);
      setNewObjective("");
    }
  };
  const handleNewObjectiveChange = (e: any) => {
    setNewObjective(e.target.value);
  };

  const handleYearButtonClick = (year: any) => {
    setSelectedYear(year);
  };

  const saveToServer = async () => {
    const goals: Goal[] = [];

    Object.keys(objectivesData).forEach((monthYear) => {
      const [month, year] = monthYear.split("/");
      const objectives = objectivesData[monthYear] as any;

      const nonEmptyObjectives = Object.keys(objectives).filter((goalName) => {
        const value = objectives[goalName];
        return value.trim() !== "";
      });

      if (nonEmptyObjectives.length > 0) {
        nonEmptyObjectives.forEach((goalName) => {
          const value = objectives[goalName];
          goals.push({
            objetivo: goalName,
            mes: month,
            ano: year,
            valor: value,
          });
        });
      }
    });

    const data = new URLSearchParams();
    data.append("goals", JSON.stringify(goals));
    data.append("email", session?.user?.email || "");
    data.append("year", selectedYear.toString());

    console.log(JSON.stringify(goals));

    try {
      // const response = await axios.post(
      //   `http://localhost:3030/users_goals/${session?.user?.email}/${selectedYear}`,
      //   JSON.stringify(goals),
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // const responseData = response.data;
      const response = await fetch(
        `/api/users_goals?email=${session?.user?.email}&year=${selectedYear}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data.toString(),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/users_goals/${session?.user?.email}/${selectedYear}`
        );
        const responseData = response.data;

        if (responseData.length > 0) {
          const formattedData = responseData.reduce((acc: any, curr: any) => {
            const key = `${curr.mes}/${curr.ano}`;
            if (!acc[key]) {
              acc[key] = {};
            }
            acc[key][curr.objetivo] = curr.valor;
            return acc;
          }, {});

          const uniqueObjectives = [
            ...new Set(responseData.map((item: any) => item.objetivo)),
          ];
          setObjectives(uniqueObjectives);

          setObjectivesData(formattedData);
        } else {
          setObjectives([]);
          setObjectivesData({});
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    if (selectedYear) {
      fetchData();
    }
  }, [session, selectedYear]);

  function handleDeleteObjective(obj: any) {
    setObjectives((prevObjectives) => prevObjectives.filter((o) => o !== obj));

    setObjectivesData((prevData: any) => {
      const newData = { ...prevData };
      for (const key of Object.keys(newData)) {
        if (newData[key].hasOwnProperty(obj)) {
          delete newData[key][obj];
        }
      }
      return newData;
    });
  }

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-600" : "bg-white";
  const bgColorTable = theme === "dark" ? "border text-white" : "bg-white";

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`${bgColor} flex flex-col space-y-4 p-8 rounded-md  transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Head>
        <title>Objetivos Mensais</title>
      </Head>
      <div className="font-bold text-lg mb-2 text-center ">
        Crie um objetivo para acompanhar
      </div>
      <select
        className="px-4 py-2 text-center border rounded"
        value={selectedYear}
        onChange={(event) => handleYearButtonClick(Number(event.target.value))}
      >
        {[2023, 2024, 2025].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {selectedYear && (
        <div className="flex space-x-4 flex-row">
          <div>
            <textarea
              className="p-2 border rounded w-56 text-center"
              rows={3}
              placeholder="Digite seu objetivo"
              value={newObjective}
              onChange={handleNewObjectiveChange}
            />
          </div>
          <div className="flex flex-col justify-center align-middle">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddObjectiveClick}
            >
              Adicionar
            </button>
            <button
              onClick={saveToServer}
              className="px-4 mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Salvar no Servidor
            </button>
          </div>
        </div>
      )}
      {selectedYear && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border-gray-400 rounded-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Detalhe suas ações</th>
                  {objectives.map((obj, index) => (
                    <th className="px-4 py-2" key={`${obj}_${index}`}>
                      {obj}
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-3"
                        onClick={() => handleDeleteObjective(obj)}
                      >
                        X
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`${bgColorTable} divide-y divide-gray-200 rounded-md`}
              >
                {filteredMonths.map((month, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-center">
                      {month}
                    </td>
                    {objectives.map((obj) => (
                      <td
                        key={`${month}_${obj}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <textarea
                          rows={2}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
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
