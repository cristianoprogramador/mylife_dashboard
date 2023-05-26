// @ts-nocheck

import { ForecastBalance } from "@/components/ForecastBalance";
import { useState, useEffect, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { format, differenceInDays } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useTheme } from "next-themes";

export default function Resume() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [thereIsData, setThereIsData] = useState(false);

  const [formData, setFormData] = useState({
    today: 2250,
    investments: 20000,
  });

  console.log(thereIsData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/users_resume?email=${session?.user?.email}`
        );
        const responseData = await response.json();
        const data = responseData[0];

        console.log("OQ VEM DO SERVIDOR", data.conta_corrente);
        console.log("OQ VEM DO SERVIDOR", data.investimentos);

        setFormData({
          today: data.conta_corrente,
          investments: data.investimentos,
        });

        setThereIsData(true);
        setIsLoading(false);
      } catch (error) {
        alert("Cadastre dados abaixo e Salve no Servidor");
      }
    };

    fetchData();
  }, [session]);

  const handleChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: parseFloat(value.replace(/[^\d,-]/g, "").replace(",", ".")),
    }));
  };

  // Formulas para Contas Mensais

  const [expensesData, setExpensesData] = useState({
    Energia: 150,
    EnergiaAvg: 170,
    Agua: 115,
    AguaAvg: 125,
  });

  const [newExpense, setNewExpense] = useState("");

  const handleChangeExpenses = (fieldName, value) => {
    setExpensesData((prevExpensesData) => ({
      ...prevExpensesData,
      [fieldName]: parseFloat(value),
    }));
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewExpense(value);
  };

  const handleAddExpense = () => {
    if (newExpense) {
      const newFieldName = newExpense.trim();
      const newFieldAvgName = `${newFieldName}Avg`;

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

  const [creditCardsData, setCreditCardsData] = useState({
    Nubank: 650,
    NubankLimit: 1000,
  });

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

  const [creditCardAvg, setCreditCardAvg] = useState(1100);

  const [paycheck, setPaycheck] = useState(3500);
  const [stocksInvestiment, setStocksInvestiment] = useState(500);
  const [stocksInvestimentAvg, setStocksInvestimentAvg] = useState(300);

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

  const formattedToday = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(formData.today);

  const formattedInvestments = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(formData.investments);

  const totalBalance =
    parseFloat(formData.today) + parseFloat(formData.investments);

  console.log("QUE ISSO", totalBalance);

  const formattedTotalBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalBalance);

  console.log("Today:", formattedToday);
  console.log("Investments:", formattedInvestments);
  console.log("Total Balance:", formattedTotalBalance);

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
    return new Date(date.getFullYear(), date.getMonth() + 1, 6);
  }

  function handleChangeFinalDate(event: any) {
    console.log("UE", event.target.value);
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
    paycheck -
    stocksInvestiment;

  const currentAccountAvg = totalAverage + stocksInvestimentAvg + creditCardAvg;

  const investmentsOfMonth =
    parseFloat(formData.investments) + stocksInvestiment;

  console.log("INDO PRA LA", currentAccount);

  console.log(parseInt(finalDate.split("-")[2]));

  const saveToServer = async () => {
    const data = {
      conta_corrente: formData.today,
      investimentos: formData.investments,
      data_vencimento: parseInt(finalDate.split("-")[2]),
    };

    if (!thereIsData) {
      console.log("ENTROU");
      try {
        const response = await fetch(
          `/api/users_resume?email=${session?.user?.email}`,
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
    } else {
      console.log("ATUALIZAR");

      try {
        const response = await fetch(
          `/api/users_resume?email=${session?.user?.email}`,
          {
            method: "PUT",
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
            <div className="flex flex-1 justify-between items-center ">
              <div className="font-bold text-white text-base ">
                Conta Corrente
              </div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={formData.today}
                className="rounded-lg p-1 text-center w-28"
                // onValueChange={(values) => {
                //   handleChange("today", values.formattedValue);
                // }}
                onValueChange={(value) =>
                  setFormData("today", value.floatValue || "")
                }
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
                // onValueChange={(values) => {
                //   handleChange("investments", values.formattedValue);
                // }}
                onValueChange={(value) =>
                  setFormData("investments", value.floatValue || "")
                }
              />
            </div>
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
                value={newExpense}
                onChange={handleInputChangeCreditCard}
                placeholder="Nome do Cartão"
                className="rounded-lg p-1 text-center w-full"
              />
            </div>

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
                  value={creditCardAvg}
                  className="rounded-lg p-2 text-center w-20 mr-6"
                  onValueChange={(values) => {
                    setCreditCardAvg(parseFloat(values.floatValue));
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
                      value={stocksInvestiment}
                      className="rounded-lg p-2 text-center w-20 flex justify-center align-middle"
                      onValueChange={(values) => {
                        setStocksInvestiment(parseFloat(values.floatValue));
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
                      value={stocksInvestimentAvg}
                      className="rounded-lg p-2 text-center w-20  flex justify-center align-middle"
                      onValueChange={(values) => {
                        setStocksInvestimentAvg(parseFloat(values.floatValue));
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
                    value={paycheck}
                    className="rounded-lg p-2 text-center w-20 mr-6"
                    onValueChange={(values) => {
                      setPaycheck(parseFloat(values.floatValue));
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
              investmentsAvg={stocksInvestimentAvg}
              paycheck={paycheck}
            />
          </div>
        </div>
        <button
          onClick={saveToServer}
          className={`${bgColorButtonGreen} h-10 justify-center items-center align-middle`}
        >
          Salvar dados no Servidor
        </button>
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
