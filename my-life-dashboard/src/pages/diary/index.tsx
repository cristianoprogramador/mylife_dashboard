import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const today = new Date().toISOString().substr(0, 10);

type Entry = {
  date: string;
  data: Record<string, string>; // Anotação de tipo para o objeto 'data'
};

export default function Diary() {
  const { data: session } = useSession();
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>(""); // Adicione a anotação de tipo string
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [options, setOptions] = useState<string[]>([]); // Adicione a anotação de tipo string[]

  const [diaryEntries, setDiaryEntries] = useState<any[]>([]); // Adicione a anotação de tipo any[]
  const [edits, setEdits] = useState<any>({});

  const { theme, setTheme } = useTheme();

  const handleAddOption = (event: any) => {
    event.preventDefault();
    const newOption = event.target.option.value.trim();
    if (newOption !== "") {
      setOptions((prevOptions): any => [...prevOptions, newOption]);
      event.target.reset();
    }
  };

  const handleAddEntry = (formData: any) => {
    const date = formData.date;
    const entry: Entry = {
      date,
      data: {}, // Inicializa a propriedade 'data' como um objeto vazio
    };
    let entryIsValid = true;

    const isDuplicate = diaryEntries.some((entry) => entry.date === date);

    if (isDuplicate) {
      setErrorMsg("Data já existente. Por favor, escolha outra data.");
      return;
    }

    options.forEach((option: string) => {
      // Adicione a anotação de tipo string
      const value = formData[option.toLowerCase()];
      if (value === "") {
        entryIsValid = false;
      }
      entry.data[option] = value;
    });
    if (entryIsValid) {
      setDiaryEntries((prevEntries): any => [...prevEntries, entry]);
      setErrorMsg("");
      reset();
    }
    // console.log("entry antes de ser adicionado:", entry);
  };

  const handleDeleteRow = (entryToDelete: any) => {
    setDiaryEntries((prevEntries) =>
      prevEntries.filter((entry) => entry !== entryToDelete)
    );
  };

  const saveToServer = async () => {
    setIsLoadingSave(true);
    const data = new URLSearchParams();
    data.append("email", session?.user?.email || "");
    data.append("diaryEntries", JSON.stringify(diaryEntries));

    try {
      const response = await fetch(
        `/api/users_diary?email=${session?.user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        }
      );
      const responseData = await response.json();
      // const response = await axios.post(
      //   `http://localhost:3030/users_diary/${session?.user?.email}`,
      //   JSON.stringify(diaryEntries),
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      console.log(responseData);
      alert("Salvo no Servidor");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
    setIsLoadingSave(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(
        //   `http://localhost:3030/users_diary/${session?.user?.email}`
        // );
        // const responseData = response.data;

        const response = await fetch(
          `/api/users_diary?email=${session?.user?.email}`
        );
        const responseData = await response.json();

        const formattedData: Record<
          string,
          Record<string, string>
        > = responseData.reduce(
          (acc: Record<string, Record<string, string>>, item: any) => {
            const oldDate = new Date(item.date).toLocaleDateString();
            const parts = oldDate.split("/");
            const newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            // console.log(newDate);

            const date = newDate;
            const type = item.type;
            const information = item.information;

            if (acc[date]) {
              acc[date][type] = information;
            } else {
              acc[date] = {
                [type]: information,
              };
            }

            return acc;
          },
          {}
        );

        const rowData = Object.entries(formattedData).map(([date, data]) => ({
          date,
          data,
        }));

        setDiaryEntries(rowData);
        const uniqueOptions = new Set<string>();
        for (let obj of rowData) {
          for (let key in obj.data) {
            uniqueOptions.add(key);
          }
        }
        setOptions(Array.from(uniqueOptions));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [session]);

  const handleInputChange = (event: any, date: any, option: any) => {
    const newEdits = { ...edits };
    if (!newEdits[date]) {
      newEdits[date] = {};
    }
    newEdits[date][option] = event.target.textContent;
    setEdits(newEdits);
  };

  const handleSave = (date: any, option: any) => {
    const entry = diaryEntries.find((e) => e.date === date);
    const newEntry = { ...entry };
    const editedValue = edits[date]?.[option];
    if (editedValue !== undefined) {
      newEntry.data[option] = edits[date][option];
      const index = diaryEntries.findIndex((e) => e.date === date);
      const newDiaryEntries = [
        ...diaryEntries.slice(0, index),
        newEntry,
        ...diaryEntries.slice(index + 1),
      ];
      setDiaryEntries(newDiaryEntries);
      setEdits({});
      saveToServer();
    }
  };

  const bgColor = theme === "dark" ? "bg-gray-600" : "bg-white";
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

  // console.log(diaryEntries);

  const handleDeleteColumn = (option: any) => {
    setOptions((prevOptions) => prevOptions.filter((item) => item !== option));
    setDiaryEntries((prevEntries: any) =>
      prevEntries.map((entry: any) => {
        const { data, ...rest } = entry;
        const newData = { ...data };
        delete newData[option];
        return { ...rest, data: newData };
      })
    );
  };

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-1 justify-center items-center">
      <div
        className={`${bgColor} p-2 space-y-4 rounded-md transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Head>
          <title>Diário da Vida</title>
        </Head>
        <div className="text-center text-2xl font-bold mb-8">
          Escreva o que você fez no dia!
        </div>
        <form onSubmit={handleAddOption}>
          <div className="flex flex-col space-x-4 items-center gap-2 md:flex-row">
            <label htmlFor="option" className="font-medium">
              Adicionar Coluna:
            </label>
            <input
              type="text"
              name="option"
              className="border-gray-400 border-2 p-2 rounded-lg"
            />
            <button type="submit" className={`${bgColorButtonBlue}`}>
              Adicionar
            </button>
          </div>
        </form>

        <form
          onSubmit={handleSubmit(handleAddEntry)}
          className=" rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-x-4 items-center">
              <label htmlFor="date" className=" font-medium">
                Data:
              </label>
              <input
                type="date"
                defaultValue={today}
                {...register("date", { required: true })}
                className="border-gray-400 border-2 p-2 rounded-lg text-center"
              />
              {errors.date && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
              {errorMsg && (
                <span className="text-red-500">
                  Essa data já tem no Formulario
                </span>
              )}
            </div>
            {options.map((option) => {
              return (
                <div
                  key={option}
                  className="flex flex-col space-x-4 items-center"
                >
                  <label
                    htmlFor={option.toLowerCase()}
                    className=" font-medium"
                  >
                    {option}:
                  </label>
                  <textarea
                    className="border-gray-400 border-2 p-2 rounded-lg w-full"
                    {...register(option.toLowerCase(), { required: true })}
                    rows={3}
                  ></textarea>
                  {errors[option.toLowerCase()] && (
                    <span className="text-red-500">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>
              );
            })}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className={`${bgColorButtonBlue} w-full md:w-auto`}
              >
                Adicionar entrada
              </button>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={saveToServer}
                type="button"
                className={`${bgColorButtonGreen} w-full md:w-auto`}
                disabled={isLoadingSave} // Desabilita o botão enquanto estiver carregando
              >
                {isLoadingSave ? "Salvando..." : "Salvar no Servidor"}
              </button>
            </div>
          </div>
        </form>

        <table className=" w-full table-auto text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-gray-800 font-medium">Data</th>
              {options.map((option) => (
                <th
                  key={option}
                  className=" py-2 px-4 text-gray-800 font-medium"
                >
                  {option}
                  <button
                    onClick={() => handleDeleteColumn(option)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-3"
                  >
                    X
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diaryEntries
              .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .map((entry) => {
                const entryDate = new Date(entry.date);
                const brazilOffset = 3 * 60; // fuso horário do Brasil é UTC-3
                const entryDateWithOffset = new Date(
                  entryDate.getTime() + brazilOffset * 60 * 1000
                );
                return (
                  <tr key={entry.date}>
                    <td className="border-gray-400 border text-center">
                      {entryDateWithOffset.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    {options.map((option) => (
                      <td
                        key={option}
                        className=" py-2 px-4 border-gray-400 border"
                      >
                        <span
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={() => handleSave(entry.date, option)}
                          onInput={(event) =>
                            handleInputChange(event, entry.date, option)
                          }
                        >
                          {entry.data[option]}
                        </span>
                      </td>
                    ))}
                    <td className=" py-2 px-4 border-gray-400 border text-center ">
                      <button
                        onClick={() => handleDeleteRow(entry)}
                        className={`${bgColorButtonRed}`}
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
