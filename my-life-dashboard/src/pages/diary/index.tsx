import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const today = new Date().toISOString().substr(0, 10);

type FormData = {
  email: string;
  date: Date;
  type: string;
  information: string;
};

export default function Diary() {
  const { data: session } = useSession();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [options, setOptions] = useState([]);

  const [diaryEntries, setDiaryEntries] = useState([]);
  const [edits, setEdits] = useState({});
  const [editing, setEditing] = useState({});
  const { theme, setTheme } = useTheme();

  const handleAddOption = (event) => {
    event.preventDefault();
    const newOption = event.target.option.value.trim();
    if (newOption !== "") {
      setOptions((prevOptions) => [...prevOptions, newOption]);
      event.target.reset();
    }
  };

  const handleAddEntry = (formData) => {
    const date = formData.date;
    const entry = {
      date,
      data: {},
    };
    let entryIsValid = true;

    const isDuplicate = diaryEntries.some((entry) => entry.date === date);

    if (isDuplicate) {
      // Exibe mensagem de erro para o usuário
      setErrorMsg("Data já existente. Por favor, escolha outra data.");
      return;
    }

    options.forEach((option) => {
      const value = formData[option.toLowerCase()];
      if (value === "") {
        entryIsValid = false;
      }
      entry.data[option] = value;
    });
    if (entryIsValid) {
      setDiaryEntries((prevEntries) => [...prevEntries, entry]);
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
    const data = new URLSearchParams();
    data.append("email", session?.user?.email);
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
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/users_diary?email=${session?.user?.email}`
        );
        const responseData = await response.json();

        const formattedData = responseData.reduce((acc, item) => {
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
        }, {});

        const rowData = Object.entries(formattedData).map(([date, data]) => ({
          date,
          data,
        }));

        setDiaryEntries(rowData);
        const uniqueOptions = new Set();
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

  const handleInputChange = (event, date, option) => {
    const newEdits = { ...edits };
    if (!newEdits[date]) {
      newEdits[date] = {};
    }
    newEdits[date][option] = event.target.textContent;
    setEdits(newEdits);
  };

  const handleSave = (date, option) => {
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

  return (
    <div className={`${bgColor} p-4 space-y-4 w-4/5 rounded-md`}>
      <div className="text-center text-2xl font-bold mb-8">
        Escreva o que você fez no dia!
      </div>
      <form onSubmit={handleAddOption}>
        <div className="flex flex-row space-x-4 items-center">
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
        <div className="grid grid-cols-3 gap-4">
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
          {options.map((option) => (
            <div key={option} className="flex flex-col space-x-4 items-center">
              <label htmlFor={option.toLowerCase()} className=" font-medium">
                {option}:
              </label>
              <textarea
                className="border-gray-400 border-2 p-2 rounded-lg w-full"
                {...register(option.toLowerCase(), { required: true })}
                rows={3}
              ></textarea>
              {errors[option.toLowerCase()] && (
                <span className="text-red-500">Este campo é obrigatório</span>
              )}
            </div>
          ))}
          <div className="flex justify-center items-center">
            <button type="submit" className={`${bgColorButtonBlue}`}>
              Adicionar entrada
            </button>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={saveToServer}
              type="button"
              className={`${bgColorButtonGreen}`}
            >
              Salvar no Servidor
            </button>
          </div>
        </div>
      </form>

      <table className="table-fixed w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 py-2 px-4 text-gray-800 font-medium">Data</th>
            {options.map((option) => (
              <th
                key={option}
                className="w-1/4 py-2 px-4 text-gray-800 font-medium"
              >
                {option}
              </th>
            ))}
            <th className="w-1/4 py-2 px-4 text-gray-800 font-medium">
              Deletar
            </th>
          </tr>
        </thead>
        <tbody>
          {diaryEntries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((entry) => {
              const entryDate = new Date(entry.date);
              const brazilOffset = 3 * 60; // fuso horário do Brasil é UTC-3
              const entryDateWithOffset = new Date(
                entryDate.getTime() + brazilOffset * 60 * 1000
              );
              return (
                <tr key={entry.date}>
                  <td className="w-1/4 py-2 px-4 border-gray-400 border text-center">
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
                      className="w-1/4 py-2 px-4 border-gray-400 border"
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
                      {edits[entry.date]?.[option] && (
                        <button
                          onClick={() => handleSave(entry.date, option)}
                          className={`${bgColorButtonBlue}`}
                        >
                          Salvar
                        </button>
                      )}
                    </td>
                  ))}
                  <td className="w-1/4 py-2 px-4 border-gray-400 border text-center ">
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
