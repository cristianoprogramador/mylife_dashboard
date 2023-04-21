import React, { useState } from "react";
import * as XLSX from "xlsx";
import { format, toDate } from "date-fns";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

type RowData = {
  Data: number;
  Descrição: string;
  Obs: string;
  Tipo: string;
  Valor: number;
  Antecipou: string;
  Cartão: string;
};

export default function History() {
  const [rowData, setRowData] = useState<RowData[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<RowData>(worksheet);

      setRowData((prevRowData) => [...prevRowData, ...rows]);
    };
    reader.readAsBinaryString(file);
  };

  const [formValues, setFormValues] = useState<RowData>({
    Data: 0,
    Descrição: "",
    Obs: "",
    Tipo: "",
    Valor: 0,
    Antecipou: "",
    Cartão: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleAddRow = () => {
    setRowData((prevData) => [...prevData, formValues]);
    setFormValues({
      Data: 0,
      Descrição: "",
      Obs: "",
      Tipo: "",
      Valor: 0,
      Antecipou: "",
      Cartão: "",
    });
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      <form className="mt-9">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Data"
            >
              Data
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Data"
              name="Data"
              type="number"
              value={formValues.Data}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Descrição"
            >
              Descrição
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Descrição"
              name="Descrição"
              type="text"
              value={formValues.Descrição}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Obs
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Obs"
              name="Obs"
              type="text"
              value={formValues.Obs}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Tipo
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Tipo"
              name="Tipo"
              type="text"
              value={formValues.Tipo}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Valor
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Valor"
              name="Valor"
              type="text"
              value={formValues.Valor}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Antecipou
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Antecipou"
              name="Antecipou"
              type="text"
              value={formValues.Antecipou}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Cartão
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Cartão"
              name="Cartão"
              type="text"
              value={formValues.Cartão}
              onChange={handleFormChange}
            />
          </div>
          <button type="button" onClick={handleAddRow}>
            Salvar
          </button>
        </div>
      </form>
      <div className="bg-white shadow-md rounded overflow-x-auto mt-9">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-blue-200 text-xs leading-normal">
              <th className="py-3 px-3 text-center">Data</th>
              <th className="py-3 px-3 text-center">Descrição</th>
              <th className="py-3 px-3 text-center">Obs</th>
              <th className="py-3 px-3 text-center">Tipo</th>
              <th className="py-3 px-3 text-center">Valor</th>
              <th className="py-3 px-3 text-center">Antecipou</th>
              <th className="py-3 px-3 text-center">Cartão</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {rowData
              .sort((a, b) => b.Data - a.Data)
              .map((row, index) => {
                const excelDate: number = row.Data;
                const jsDate = toDate((excelDate - (25567 + 1)) * 86400 * 1000);
                // converte para data do JavaScript
                const formattedDate = format(jsDate, "dd/MM/yyyy");

                return (
                  <tr
                    className="border-b border-gray-200 hover:bg-blue-100"
                    key={index}
                  >
                    <td className="py-3 px-3 text-center ">{formattedDate}</td>
                    <td className="py-3 px-3 text-center ">{row.Descrição}</td>
                    <td className="py-3 px-3 text-center ">{row.Obs}</td>
                    <td className="py-3 px-3 text-center ">{row.Tipo}</td>
                    <td className="py-3 px-3 text-center ">{row.Valor}</td>
                    <td className="py-3 px-3 text-center ">{row.Antecipou}</td>
                    <td className="py-3 px-3 text-center ">{row.Cartão}</td>
                  </tr>
                );
              })}
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
