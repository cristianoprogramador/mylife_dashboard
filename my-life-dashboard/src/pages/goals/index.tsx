import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useContext, useState } from "react";

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

export default function Goals() {
  const [objectivesData, setObjectivesData] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState("");
  const [addObjectiveClicked, setAddObjectiveClicked] = useState(false);

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

  return (
    <div className="flex flex-col space-y-4">
      <Head>
        <title>Objetivos Mensais</title>
      </Head>
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
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border-gray-400">
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
          <tbody>
            {months.map((month) => (
              <tr key={month}>
                <td>{month}</td>
                {objectives.map((obj) => (
                  <td key={`${month}_${obj}`}>
                    <textarea
                      rows={2}
                      className="border rounded w-full p-2"
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
