import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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

export const objectives = ["Profissional", "Financeiro", "Saúde", "Família"];

export default function Goals() {
  const [objectivesData, setObjectivesData] = useState({});

  console.log(objectivesData);

  const handleInputChange = (e, month, objective) => {
    const newObjectivesData = { ...objectivesData };
    if (!newObjectivesData[month]) {
      newObjectivesData[month] = {};
    }
    newObjectivesData[month][objective] = e.target.value;
    setObjectivesData(newObjectivesData);
  };

  return (
    <div>
      <table className="w-full table-auto border-collapse border-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2">Objetivo por Mês</th>
            {objectives.map((obj) => (
              <>
                <th className="px-4 py-2" key={obj}>
                  {obj}
                </th>
                <th className="px-4 py-2">Objetivos Conquistados</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {months.map((month, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{month}</td>
              {objectives.map((obj, index) => (
                <React.Fragment key={`${month}_${obj}_${index}`}>
                  <td className="border px-4 py-2">
                    <textarea
                      value={objectivesData[month]?.[obj] || ""}
                      onChange={(e) => handleInputChange(e, month, obj)}
                      className="w-full border rounded py-1 px-3"
                      rows={3}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <textarea
                      value={objectivesData[month]?.[`${obj}_conquered`] || ""}
                      onChange={(e) =>
                        handleInputChange(e, month, `${obj}_conquered`)
                      }
                      className="w-full border rounded py-1 px-3"
                      rows={3}
                    />
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
