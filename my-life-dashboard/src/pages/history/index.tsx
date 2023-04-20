import React, { useState } from "react";
import * as XLSX from "xlsx";
import { format, toDate } from "date-fns";

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

      setRowData(rows);
    };
    reader.readAsBinaryString(file);
  };

  console.log(rowData);

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
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
            {rowData.map((row, index) => {
              const excelDate: number = row.Data;
              const jsDate = toDate((excelDate - 25569) * 86400 * 1000); // converte para data do JavaScript
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
