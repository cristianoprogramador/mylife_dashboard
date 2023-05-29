// @ts-nocheck

import { ForecastBalance } from "@/components/ForecastBalance";
import { useState, useEffect, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { format, differenceInDays } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useTheme } from "next-themes";

export default function Resume({
  initialFormData,
  expensesDataAll,
  cardsDataAll,
  hasError1,
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [saveServer, setSaveServer] = useState(false);
  const [saveServerExpenses, setSaveServerExpenses] = useState(false);
  const [saveServerCards, setSaveServerCards] = useState(false);

  const mappedData = expensesDataAll.map(({ expense_type, value }) => ({
    expense_type,
    value: parseFloat(Number(value).toFixed(2)),
  }));

  const initialExpensesData = mappedData.reduce(
    (acc, { expense_type, value }) => {
      return { ...acc, [expense_type]: value };
    },
    {}
  );

  const [formData, setFormData] = useState({
    today: parseFloat(Number(initialFormData.today).toFixed(2)),
    investments: parseFloat(Number(initialFormData.investments).toFixed(2)),
    creditCardAvg: parseFloat(Number(initialFormData.creditCardAvg).toFixed(2)),
    paycheck: parseFloat(Number(initialFormData.paycheck).toFixed(2)),
    stocksInvestiment: parseFloat(
      Number(initialFormData.stocksInvestiment).toFixed(2)
    ),
    stocksInvestimentAvg: parseFloat(
      Number(initialFormData.stocksInvestimentAvg).toFixed(2)
    ),
  });

  const handleChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: parseFloat(value),
    }));
    setSaveServer(true);
  };

  // Formulas para Contas Mensais

  const defaultExpensesData = {
    Energia: 220,
    EnergiaAvg: 250,
    Agua: 110,
    AguaAvg: 100,
  };

  const [expensesData, setExpensesData] = useState(
    initialExpensesData ?? defaultExpensesData
  );

  const [newExpense, setNewExpense] = useState("");

  const handleChangeExpenses = (fieldName, value) => {
    setExpensesData((prevExpensesData) => ({
      ...prevExpensesData,
      [fieldName]: parseFloat(value),
    }));
    setSaveServerExpenses(true);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewExpense(value);
  };

  const handleAddExpense = () => {
    if (newExpense) {
      const newFieldName = newExpense.trim();
      const newFieldAvgName = `${newFieldName}Avg`;

      setSaveServerExpenses(true);

      setExpensesData((prevExpensesData) => ({
        ...prevExpensesData,
        [newFieldName]: 0,
        [newFieldAvgName]: 0,
      }));

      setNewExpense("");
    }
  };

  const handleDeleteExpense = (index) => {
    const fieldName = Object.keys(expensesData)[index];
    const avgFieldName = Object.keys(expensesData)[index + 1];

    setSaveServerExpenses(true);

    setExpensesData((prevExpensesData) => {
      const updatedExpensesData = { ...prevExpensesData };
      delete updatedExpensesData[fieldName];
      delete updatedExpensesData[avgFieldName];
      return updatedExpensesData;
    });
  };

  const renderExpenseFields = () => {
    return Object.entries(expensesData).map(([field, value], index) => {
      if (index % 2 === 0) {
        const nextField = Object.entries(expensesData)[index + 1][0];
        const nextValue = Object.entries(expensesData)[index + 1][1];

        return (
          <div
            key={field}
            className="flex flex-1 justify-between items-center gap-2"
          >
            <div className="font-bold text-white text-sm text-end justify-around flex flex-1">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-3"
                onClick={() => handleDeleteExpense(index)}
              >
                X
              </button>{" "}
              {field}
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={value}
                onValueChange={(values) =>
                  handleChangeExpenses(field, values.floatValue)
                }
                className="rounded-lg p-2 text-sm w-20 text-center"
              />
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={nextValue}
                onValueChange={(values) =>
                  handleChangeExpenses(nextField, values.floatValue)
                }
                className="rounded-lg p-2 text-sm w-20 text-center"
              />
            </div>
          </div>
        );
      }

      return null;
    });
  };

  // Formulas para Cartões de Créditos

  const mappedDataCards = cardsDataAll.map(({ credit_cards, value }) => ({
    credit_cards,
    value: parseFloat(Number(value).toFixed(2)),
  }));

  const initialExpensesDataCards = mappedDataCards.reduce(
    (acc, { credit_cards, value }) => {
      return { ...acc, [credit_cards]: value };
    },
    {}
  );

  const defaultCardsData = {
    Nubank: 650,
    NubankLimit: 1000,
    Santander: 250,
    SantanderLimit: 450,
  };

  const [creditCardsData, setCreditCardsData] = useState(
    initialExpensesDataCards ?? defaultCardsData
  );

  const [newCreditCard, setNewCreditCard] = useState("");

  const handleChangeCreditCard = (fieldName, value) => {
    setCreditCardsData((prevExpensesData) => ({
      ...prevExpensesData,
      [fieldName]: parseFloat(value),
    }));
  };

  const handleInputChangeCreditCard = (e) => {
    const { value } = e.target;
    setNewCreditCard(value);
  };

  const handleAddCreditCard = () => {
    if (newCreditCard) {
      const newFieldName = newCreditCard.trim();
      const newFieldAvgName = `${newFieldName}Avg`;

      setCreditCardsData((prevExpensesData) => ({
        ...prevExpensesData,
        [newFieldName]: 0,
        [newFieldAvgName]: 0,
      }));

      setNewCreditCard("");
      setSaveServerCards(true);
    }
  };

  const handleDeleteExpenseCreditCard = (index) => {
    const fieldName = Object.keys(creditCardsData)[index];
    const avgFieldName = Object.keys(creditCardsData)[index + 1];

    setCreditCardsData((prevExpensesData) => {
      const updatedExpensesData = { ...prevExpensesData };
      delete updatedExpensesData[fieldName];
      delete updatedExpensesData[avgFieldName];
      return updatedExpensesData;
    });
  };

  const renderExpenseFieldsCreditCard = () => {
    return Object.entries(creditCardsData).map(([field, value], index) => {
      if (index % 2 === 0) {
        const nextField = Object.entries(creditCardsData)[index + 1][0];
        const nextValue = Object.entries(creditCardsData)[index + 1][1];

        return (
          <div
            key={field}
            className="flex flex-1 justify-between items-center gap-2"
          >
            <div className="font-bold text-white text-sm text-end justify-around flex flex-1">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-3"
                onClick={() => handleDeleteExpenseCreditCard(index)}
              >
                X
              </button>{" "}
              {field}
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={value}
                onValueChange={(values) =>
                  handleChangeCreditCard(field, values.floatValue)
                }
                className="rounded-lg p-2 text-sm w-20 text-center"
              />
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={nextValue}
                onValueChange={(values) =>
                  handleChangeCreditCard(nextField, values.floatValue)
                }
                className="rounded-lg p-2 text-sm w-20 text-center"
              />
            </div>
          </div>
        );
      }

      return null;
    });
  };

  const totalCurrent = Object.entries(expensesData).reduce(
    (total, [field, value], index) => {
      if (index % 2 === 0) {
        return total + parseFloat(value);
      }
      return total;
    },
    0
  );

  const totalAverage = Object.entries(expensesData).reduce(
    (total, [field, value], index) => {
      if (index % 2 !== 0) {
        return total + parseFloat(value);
      }
      return total;
    },
    0
  );

  const totalCardsCurrent = Object.entries(creditCardsData).reduce(
    (total, [field, value], index) => {
      if (index % 2 === 0) {
        return total + parseFloat(value);
      }
      return total;
    },
    0
  );

  const totalCardsLimits = Object.entries(creditCardsData).reduce(
    (total, [field, value], index) => {
      if (index % 2 !== 0) {
        return total + parseFloat(value);
      }
      return total;
    },
    0
  );

  const totalBalance =
    parseFloat(formData.today) + parseFloat(formData.investments);

  const formattedTotalBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalBalance);

  const totalCurrentFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalCurrent);

  const totalAverageFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalAverage);

  const totalCardsCurrentFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalCardsCurrent);

  const totalCardsAverageFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalCardsLimits);

  const now = new Date();
  const [todayDate, setTodayDate] = useState(format(now, "yyyy-MM-dd"));
  const [finalDate, setFinalDate] = useState(
    format(getFinalDate(now), "yyyy-MM-dd")
  );

  function getFinalDate(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      initialFormData.vencimento
    );
  }

  function handleChangeFinalDate(event: any) {
    // console.log("UE", event.target.value);
    setSaveServer(true);
    setFinalDate(event.target.value);
  }

  const [daysRemaining, setDaysRemaining] = useState(0);

  const getDaysRemaining = useCallback(() => {
    const today = new Date(format(new Date(), "yyyy-MM-dd"));
    const final = new Date(finalDate);
    const diffDays = differenceInDays(final, today);
    return diffDays;
  }, [finalDate]);

  useEffect(() => {
    setDaysRemaining(getDaysRemaining());
  }, [getDaysRemaining, finalDate]);

  // const valueLeft = paycheck - stocksInvestiment - totalCurrent;
  const valueLeft = totalCardsLimits - totalCardsCurrent;

  const formattedValue = valueLeft.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const valueLeftPerDay = valueLeft / daysRemaining;
  const formattedValuePerDay = valueLeftPerDay.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  /// Passado para o componente:

  const currentAccount =
    formData.today -
    totalCurrent -
    totalCardsLimits +
    formData.paycheck -
    formData.stocksInvestiment;

  const currentAccountAvg =
    totalAverage + formData.stocksInvestimentAvg + formData.creditCardAvg;

  const investmentsOfMonth =
    parseFloat(formData.investments) + formData.stocksInvestiment;

  // console.log(parseInt(finalDate.split("-")[2]));

  const saveToServer = async () => {
    const data = {
      conta_corrente: formData.today,
      investimentos: formData.investments,
      allcards: formData.creditCardAvg,
      investimentos_no_mes: formData.stocksInvestiment,
      investimentos_na_media: formData.stocksInvestimentAvg,
      salario: formData.paycheck,
      data_vencimento: parseInt(finalDate.split("-")[2]),
    };

    if (hasError1) {
      // console.log("ENTROU");
      try {
        const response = await fetch(
          `/api/users_resume?email=${session?.user?.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.token}`, // Passa o token no cabeçalho de autorização
            },
            body: JSON.stringify(data),
          }
        );
        const responseData = await response.json();
        setSaveServer(false);
        alert("Dados Salvos com sucesso!");
        console.log(responseData);
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    } else {
      // console.log("ATUALIZAR");

      try {
        const response = await fetch(
          `/api/users_resume?email=${session?.user?.email}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.token}`, // Passa o token no cabeçalho de autorização
            },
            body: JSON.stringify(data),
          }
        );
        const responseData = await response.json();
        alert("Dados Salvos com sucesso!");
        setSaveServer(false);
        console.log(responseData);
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    }
  };

  const saveToServerExpenses = async () => {
    const data = {
      rowData: Object.entries(expensesData).map(([expenseType, value]) => ({
        expenseType,
        value,
      })),
    };
    console.log(data);
    try {
      const response = await fetch(
        `/api/users_resume_expenses?email=${session?.user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`, // Passa o token no cabeçalho de autorização
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      alert("Dados Salvos com sucesso!");
      setSaveServerExpenses(false);
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const saveToServerCards = async () => {
    const data = {
      rowData: Object.entries(creditCardsData).map(([credit_cards, value]) => ({
        credit_cards,
        value,
      })),
    };
    console.log(data);
    try {
      const response = await fetch(
        `/api/users_resume_cards?email=${session?.user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`, // Passa o token no cabeçalho de autorização
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      alert("Dados Salvos com sucesso!");
      saveServerCards(false);
      console.log(responseData);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-slate-600" : "bg-blue-600";
  const bgColorTotals = theme === "dark" ? "bg-gray-900" : "bg-white";
  const bgColorButtonGreen =
    theme === "dark"
      ? "py-1 px-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75 transition duration-100 ease-in-out text-center"
      : "py-1 px-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-100 ease-in-out text-center";

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-1 justify-center items-center">
      <div
        className={`flex flex-col items-center transition-opacity duration-150 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Head>
          <title>Resumo</title>
        </Head>
        <div className="flex md:flex-row gap-2 p-2 flex-col">
          {/* Primeiro Bloco */}
          <div className={`${bgColor} rounded-lg p-4 flex flex-col w-96 gap-2`}>
            <div className="font-bold text-white text-lg mb-2 text-center ">
              Status Geral
            </div>
            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <>
                <div className="flex flex-1 justify-between items-center">
                  <div className="font-bold text-white text-base">
                    Conta Corrente
                  </div>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    allowNegative={false}
                    value={formData.today}
                    className="rounded-lg p-1 text-center w-28"
                    onValueChange={(values) => {
                      handleChange("today", values.floatValue);
                    }}
                  />
                </div>
                <div className="flex flex-1 justify-between items-center">
                  <div className="font-bold text-white text-base">
                    Investimentos / Cripto
                  </div>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    allowNegative={false}
                    value={formData.investments}
                    className="rounded-lg p-1 text-center w-28"
                    onValueChange={(values) => {
                      handleChange("investments", values.floatValue);
                    }}
                  />
                </div>
              </>
            )}

            <div className="flex flex-1 justify-evenly items-center">
              <div className="font-bold text-white text-base">
                Total Patrimônio Hoje
              </div>
              <div
                className={`${bgColorTotals} rounded-lg flex p-1 px-3 justify-center`}
              >
                {formattedTotalBalance}
              </div>
            </div>
            {saveServer && (
              <button
                onClick={saveToServer}
                className={`${bgColorButtonGreen} `}
              >
                Salvar dados no Servidor
              </button>
            )}
          </div>
          {/* Segundo Bloco */}
          <div
            className={`${bgColor} rounded-lg  flex flex-col gap-2 w-96 p-4`}
          >
            <div className="flex flex-row  ">
              <div className="flex flex-1 justify-center items-center flex-col">
                <div className="font-bold text-white text-base mb-2 text-center ">
                  Data Hoje
                </div>
                <input
                  type="date"
                  className="p-2 rounded-lg text-center"
                  value={todayDate}
                  disabled
                  readOnly
                />
              </div>
              <div className="flex flex-1 justify-center items-center flex-col">
                <div className="font-bold text-white text-base mb-2 text-center ">
                  Data Vencimento
                </div>
                <input
                  type="date"
                  className="p-2 rounded-lg text-center"
                  value={finalDate}
                  onChange={handleChangeFinalDate}
                />
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="flex flex-1 justify-center items-center flex-col">
                <div className="font-bold text-white text-base mb-2 text-center ">
                  Valor Sobrando
                </div>
                <div className={`${bgColorTotals} p-3 rounded-lg`}>
                  {formattedValue}
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center flex-col">
                <div className="font-bold text-white text-base mb-2 text-center ">
                  Valor por Dia
                </div>
                <div className={`${bgColorTotals} p-3 rounded-lg`}>
                  {formattedValuePerDay}
                </div>
              </div>
              <div className="flex flex-1 justify-center items-center flex-col">
                <div className="font-bold text-white text-base mb-2 text-center ">
                  Dias Restantes
                </div>
                <input
                  value={daysRemaining}
                  className="p-2 rounded-lg text-center w-20"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terceiro Bloco */}
        <div className="flex md:flex-row flex-col gap-2 p-2 justify-center align-middle items-center">
          <div className={`${bgColor} rounded-lg p-4 flex flex-col gap-3 w-80`}>
            <div className="font-bold text-white text-lg mb-2 text-center">
              Contas do Mês x Média Anual
            </div>
            {renderExpenseFields()}
            <div className="flex flex-row justify-around gap-2">
              <button
                onClick={handleAddExpense}
                className={`${bgColorButtonGreen}`}
              >
                Adicionar
              </button>

              <input
                type="text"
                value={newExpense}
                onChange={handleInputChange}
                placeholder="Nome da Despesa"
                className="rounded-lg p-1 text-center w-full"
              />
            </div>

            <div className="flex flex-1 justify-between items-center">
              <div className="font-bold text-white text-lg justify-center flex flex-1">
                Total
              </div>
              <div className="flex gap-2 flex-row">
                <div
                  className={`${bgColorTotals} rounded-lg flex p-3 w-30  justify-center`}
                >
                  {totalCurrentFormatted}
                </div>
                <div
                  className={`${bgColorTotals} rounded-lg flex p-3 w-30  justify-center`}
                >
                  {totalAverageFormatted}
                </div>
              </div>
            </div>
            {saveServerExpenses && (
              <button
                onClick={saveToServerExpenses}
                className={`${bgColorButtonGreen} `}
              >
                Salvar dados no Servidor
              </button>
            )}
          </div>
          {/* AQUI */}
          <div className={`${bgColor} rounded-lg p-4 flex flex-col gap-3 w-96`}>
            <div className="font-bold text-white text-lg mb-2 text-center">
              Valor atual x Limite Estabelecido
            </div>
            {renderExpenseFieldsCreditCard()}
            <div className="flex flex-row justify-around gap-2">
              <button
                onClick={handleAddCreditCard}
                className={`${bgColorButtonGreen}`}
              >
                Adicionar
              </button>

              <input
                type="text"
                value={newCreditCard}
                onChange={handleInputChangeCreditCard}
                placeholder="Nome do Cartão"
                className="rounded-lg p-1 text-center w-full"
              />
            </div>
            {saveServerCards && (
              <button
                onClick={saveToServerCards}
                className={`${bgColorButtonGreen} `}
              >
                Salvar dados no Servidor
              </button>
            )}
            <div className="flex flex-1 justify-between items-center">
              <div className="font-bold text-white text-base justify-center flex flex-1">
                Total dos Cartões
              </div>
              <div className="flex gap-2 flex-row">
                <div
                  className={`${bgColorTotals} rounded-lg flex p-3 w-30  justify-center`}
                >
                  {totalCardsCurrentFormatted}
                </div>
                <div
                  className={`${bgColorTotals} rounded-lg flex p-3 w-30  justify-center`}
                >
                  {totalCardsAverageFormatted}
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-between items-center">
              <div className="font-bold text-white text-base justify-center flex flex-1 flex-col text-center">
                Média de Gasto Variável
                <div className="text-center">(Soma dos Cartões)</div>
              </div>
              <div>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={formData.creditCardAvg}
                  className="rounded-lg p-1 text-center w-28"
                  onValueChange={(values) => {
                    handleChange("creditCardAvg", values.floatValue);
                  }}
                />
              </div>
            </div>
            <div
              className={`${bgColor} border-2 rounded-lg p-4 flex flex-col gap-3`}
            >
              <div className="flex flex-1 justify-center items-center">
                <div className="flex  justify-center items-center flex-col w-1/2">
                  <div className="font-bold text-white text-base text-center">
                    Investimento
                  </div>
                  <div className="font-bold text-white text-base text-center">
                    no Mês Atual
                  </div>
                  <div>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowNegative={false}
                      value={formData.stocksInvestiment}
                      className="rounded-lg p-2 text-center w-20 flex justify-center align-middle"
                      onValueChange={(values) => {
                        handleChange("stocksInvestiment", values.floatValue);
                      }}
                    />
                  </div>
                </div>
                <div className="flex  justify-center items-center flex-col  w-1/2">
                  <div className="font-bold text-white text-base text-center">
                    Média Anual de Investimento
                  </div>
                  <div>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowNegative={false}
                      value={formData.stocksInvestimentAvg}
                      className="rounded-lg p-2 text-center w-20  flex justify-center align-middle"
                      onValueChange={(values) => {
                        handleChange("stocksInvestimentAvg", values.floatValue);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center gap-10 items-center">
                <div className="font-bold text-white text-base">
                  Salário Liquido
                </div>
                <div>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    allowNegative={false}
                    value={formData.paycheck}
                    className="rounded-lg p-2 text-center w-20 mr-6"
                    onValueChange={(values) => {
                      handleChange("paycheck", values.floatValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Quarto Bloco */}
          <div
            className={`${bgColor} rounded-lg md:p-4 p-1 flex flex-col gap-3`}
          >
            <ForecastBalance
              month={finalDate}
              currentAccount={currentAccount}
              currentAccountAvg={currentAccountAvg}
              investments={investmentsOfMonth}
              investmentsAvg={formData.stocksInvestimentAvg}
              paycheck={formData.paycheck}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    let initialFormData = {
      today: 0,
      investments: 0,
    };
    let expensesDataAll = [];
    let cardsDataAll = [];

    let hasError1 = false; // Variável para controlar se houve erro no primeiro fetch
    let hasError2 = false; // Variável para controlar se houve erro no segundo fetch
    let hasError3 = false; // Variável para controlar se houve erro no terceiro fetch

    try {
      const response1 = await fetch(
        `https://mylife-dashboard.vercel.app/api/users_resume?email=${session?.user?.email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      const responseData1 = await response1.json();
      const data1 = responseData1[0];

      initialFormData = {
        today: data1.conta_corrente,
        investments: data1.investimentos,
        vencimento: data1.data_vencimento,
        creditCardAvg: data1.allcards,
        stocksInvestiment: data1.investimentos_no_mes,
        stocksInvestimentAvg: data1.investimentos_na_media,
        paycheck: data1.salario,
      };
    } catch (error) {
      console.log("Erro ao obter dados de users_resume:", error);
      hasError1 = true; // Define que houve erro no primeiro fetch
    }

    try {
      const response2 = await fetch(
        `https://mylife-dashboard.vercel.app/api/users_resume_expenses?email=${session?.user?.email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      const responseData2 = await response2.json();
      expensesDataAll = responseData2;
    } catch (error) {
      console.log("Erro ao obter dados de user_resume_expenses:", error);
      hasError2 = true; // Define que houve erro no segundo fetch
    }

    try {
      const response3 = await fetch(
        `https://mylife-dashboard.vercel.app/api/users_resume_cards?email=${session?.user?.email}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      const responseData3 = await response3.json();
      cardsDataAll = responseData3;
    } catch (error) {
      console.log("Erro ao obter dados de user_resume_cards:", error);
      hasError3 = true; // Define que houve erro no terceiro fetch
    }

    if (hasError1 && hasError2 && hasError3) {
      // Retorna os dados falsos para todos os fetches
      return {
        props: {
          session,
          initialFormData: {
            today: 2200,
            investments: 35000,
            vencimento: 8,
            creditCardAvg: 500,
            stocksInvestiment: 350,
            stocksInvestimentAvg: 300,
            paycheck: 3500,
          },
          expensesDataAll: [],
          cardsDataAll: [],
          hasError1,
        },
      };
    } else if (hasError1 && hasError2) {
      // Retorna os dados falsos apenas para o primeiro e segundo fetches
      return {
        props: {
          session,
          initialFormData: {
            today: 2200,
            investments: 35000,
            vencimento: 8,
            creditCardAvg: 500,
            stocksInvestiment: 350,
            stocksInvestimentAvg: 300,
            paycheck: 3500,
          },
          expensesDataAll: [],
          cardsDataAll,
          hasError1,
        },
      };
    } else if (hasError1 && hasError3) {
      // Retorna os dados falsos apenas para o primeiro e terceiro fetches
      return {
        props: {
          session,
          initialFormData: {
            today: 2200,
            investments: 35000,
            vencimento: 8,
            creditCardAvg: 500,
            stocksInvestiment: 350,
            stocksInvestimentAvg: 300,
            paycheck: 3500,
          },
          expensesDataAll,
          cardsDataAll: [],
          hasError1,
        },
      };
    } else if (hasError2 && hasError3) {
      // Retorna os dados falsos apenas para o segundo e terceiro fetches
      return {
        props: {
          session,
          initialFormData,
          expensesDataAll: [],
          cardsDataAll: [],
          hasError1,
        },
      };
    } else if (hasError1) {
      // Retorna os dados falsos apenas para o primeiro fetch
      return {
        props: {
          session,
          initialFormData: {
            today: 2200,
            investments: 35000,
            vencimento: 8,
            creditCardAvg: 500,
            stocksInvestiment: 350,
            stocksInvestimentAvg: 300,
            paycheck: 3500,
          },
          expensesDataAll,
          cardsDataAll,
          hasError1,
        },
      };
    } else if (hasError2) {
      // Retorna os dados falsos apenas para o segundo fetch
      return {
        props: {
          session,
          initialFormData,
          expensesDataAll: [],
          cardsDataAll,
          hasError1,
        },
      };
    } else if (hasError3) {
      // Retorna os dados falsos apenas para o terceiro fetch
      return {
        props: {
          session,
          initialFormData,
          expensesDataAll,
          cardsDataAll: [],
          hasError1,
        },
      };
    }

    return {
      props: {
        session,
        initialFormData,
        expensesDataAll,
        cardsDataAll,
        hasError1,
      },
    };
  } catch (error) {
    console.log("Erro geral:", error);
    return {
      props: {
        session,
        initialFormData: {
          today: 2200,
          investments: 35000,
          vencimento: 8,
          creditCardAvg: 500,
          stocksInvestiment: 350,
          stocksInvestimentAvg: 300,
          paycheck: 3500,
        },
        expensesDataAll: [],
        cardsDataAll: [],
        hasError1,
      },
    };
  }
};
