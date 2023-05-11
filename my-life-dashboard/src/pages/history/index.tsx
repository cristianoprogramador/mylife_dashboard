import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { format, toDate } from "date-fns";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { NumericFormat } from "react-number-format";
import Head from "next/head";
import { useTheme } from "next-themes";

type RowData = {
  Data: number;
  Descrição: string;
  Obs: string;
  Tipo: string;
  Valor: number;
  Cartão: string;
};

type SpendingHistoryData = {
  id: number;
  email: string;
  card: string;
  date: string;
  description: string;
  type: string;
  value: number;
  obs: string;
};

interface FormChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    name: string;
    value: string;
  };
}

const today = new Date();
const todayInExcel =
  Math.floor((today.getTime() - new Date(1899, 11, 31).getTime()) / 86400000) +
  1;

export default function History() {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);
  const { data: session } = useSession();

  const [data, setData] = useState<RowData[]>([]);

  // console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/spending_history?email=${session?.user?.email}`
        );
        const responseData = await response.json();

        const formattedData = responseData.map((item: SpendingHistoryData) => {
          const date = new Date(item.date);
          const excelDate =
            Math.floor(
              (date.getTime() - new Date(1899, 11, 30).getTime()) / 86400000
            ) + 1;
          const rowData: RowData = {
            Data: excelDate,
            Descrição: item.description,
            Obs: item.obs,
            Tipo: item.type,
            Valor: item.value,
            Cartão: item.card,
          };

          return rowData;
        });

        setRowData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [session]);

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

      const expectedColumns = [
        "Data",
        "Descrição",
        "Obs",
        "Tipo",
        "Valor",
        "Cartão",
      ]; // nomes das colunas esperadas
      const columnNames = Object.keys(rows[0]); // pega os nomes das colunas do arquivo carregado

      // verifica se todas as colunas esperadas estão presentes no arquivo
      if (!expectedColumns.every((column) => columnNames.includes(column))) {
        setErrorMessage(
          "Arquivo inválido: faltando colunas (verifique se o nome está igual da tabela exemplo)"
        );
        return;
      }

      setErrorMessage("");
      setRowData((prevRowData) => [...prevRowData, ...rows]);
    };
    reader.readAsBinaryString(file);
  };

  const [formValues, setFormValues] = useState<RowData>({
    Data: todayInExcel,
    Descrição: "",
    Obs: "",
    Tipo: "",
    Valor: 0,
    Cartão: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "Valor") {
      // Remove o prefixo "R$ " e o separador de milhar
      const valorSemPrefixo = value.replace("R$ ", "").replace(".", "");

      // Converte o valor para number
      const valorNumerico = parseFloat(valorSemPrefixo.replace(",", "."));

      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: valorNumerico,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
    setIsFormValid(true);
  };

  const handleDateChange = (event: any) => {
    const newDate = new Date(event.target.value);
    const excelDate =
      Math.floor(
        (newDate.getTime() - new Date(1899, 11, 30).getTime()) / 86400000
      ) + 1;
    // setExcelDate(excelDate);
    setFormValues((prevValues) => ({
      ...prevValues,
      Data: excelDate,
    }));
  };

  const handleAddRow = () => {
    if (Object.values(formValues).every((value) => value !== "")) {
      setRowData((prevData) => [...prevData, formValues]);
      setFormValues({
        Data: todayInExcel,
        Descrição: "",
        Obs: "",
        Tipo: "",
        Valor: 0,
        Cartão: "",
      });
    } else {
      console.log("TA FALTANDO AE");
    }
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = "/TabelaExemplo.xlsx";
    link.download = "TabelaExemplo.xlsx";
    link.click();
  };

  const handleDeleteRow = (index: number) => {
    console.log(index);
    setRowData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const saveToServer = async () => {
    const data = {
      email: session?.user?.email,
      rowData: rowData,
    };
    try {
      const response = await fetch(
        `/api/spending_history?email=${session?.user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-400" : "bg-white";
  const bgColorTable = theme === "dark" ? "bg-gray-300" : "bg-blue-200";
  const bgColorHover =
    theme === "dark"
      ? "border-b border-gray-200 hover:bg-gray-400"
      : "border-b border-gray-200 hover:bg-blue-100";
  const bgColorButtonBlue =
    theme === "dark"
      ? "py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75 transition duration-100 ease-in-out"
      : "py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-100 ease-in-out";
  const bgColorButtonRed =
    theme === "dark"
      ? "py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-75 transition duration-100 ease-in-out"
      : "py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-100 ease-in-out";
  const bgColorButtonGreen =
    theme === "dark"
      ? "py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75 transition duration-100 ease-in-out"
      : "py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-100 ease-in-out";

  return (
    <div className={`${bgColor} p-8 rounded-md`}>
      <Head>
        <title>Histórico de Gasto</title>
      </Head>
      <div className="flex flex-row justify-between ">
        <div className="flex gap-3">
          <label className={`${bgColorButtonBlue}`}>
            <span>Selecionar arquivo</span>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            className={`${bgColorButtonRed}`}
            onClick={() => setRowData([])}
          >
            Limpar dados
          </button>
        </div>
        <div>
          <button onClick={downloadFile} className={`${bgColorButtonGreen}`}>
            Download da Tabela Exemplo
          </button>
        </div>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form className="mt-9">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Data"
            >
              Data
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              type="date"
              id="date"
              name="date"
              onChange={handleDateChange}
              required
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Descrição"
            >
              Descrição
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              id="Descrição"
              name="Descrição"
              type="text"
              value={formValues.Descrição}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="Obs">
              Obs
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              id="Obs"
              name="Obs"
              type="text"
              value={formValues.Obs}
              onChange={handleFormChange}
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Tipo"
            >
              Tipo
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              id="Tipo"
              name="Tipo"
              type="text"
              value={formValues.Tipo}
              onChange={handleFormChange}
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Valor"
            >
              Valor
            </label>
            <NumericFormat
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              id="Valor"
              name="Valor"
              value={formValues.Valor}
              onValueChange={(values) =>
                handleFormChange({
                  target: {
                    name: "Valor",
                    value: values.formattedValue,
                  },
                } as FormChangeEvent)
              }
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="Cartão"
            >
              Cartão
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-md focus:outline-none focus:shadow-outline-gray"
              id="Cartão"
              name="Cartão"
              type="text"
              value={formValues.Cartão}
              onChange={handleFormChange}
            />
          </div>
          <div className="flex justify-center align-middle items-end">
            <button
              type="button"
              onClick={handleAddRow}
              className={`${bgColorButtonBlue}`}
            >
              Adicionar na Lista
            </button>
          </div>
          <div className="flex justify-center align-middle items-end">
            <button
              type="button"
              onClick={saveToServer}
              className={`${bgColorButtonGreen}`}
            >
              Salvar no Servidor
            </button>
          </div>
        </div>
      </form>
      <div className="bg-white shadow-md rounded overflow-x-auto mt-9">
        <table className="min-w-max w-full table-auto text-black">
          <thead>
            <tr className={`${bgColorTable} text-xs leading-normal`}>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Data
              </th>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Descrição
              </th>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Obs
              </th>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Tipo
              </th>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Valor
              </th>
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Cartão
              </th>
              {/* <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Editar Info.
              </th> */}
              <th className="py-2 px-2 text-sm shadow-md hover:bg-blue-100">
                Deletar Info.
              </th>
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
                  <tr className={` ${bgColorHover}`} key={index}>
                    <td className="py-3 px-3 text-center ">{formattedDate}</td>
                    <td className="py-3 px-3 text-center ">{row.Descrição}</td>
                    <td className="py-3 px-3 text-center ">{row.Obs}</td>
                    <td className="py-3 px-3 text-center ">{row.Tipo}</td>
                    <td className="py-3 px-3 text-center ">
                      R$:{" "}
                      {Number(row.Valor).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-3 text-center ">{row.Cartão}</td>
                    {/* <td className="py-3 px-3 text-center">
                      <ModalUpdate title="Abrir Modal" state={row} />
                    </td> */}
                    <td className="py-3 px-3 text-center">
                      <button
                        className={`${bgColorButtonRed}`}
                        onClick={() => handleDeleteRow(index)}
                      >
                        Excluir
                      </button>
                    </td>
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
