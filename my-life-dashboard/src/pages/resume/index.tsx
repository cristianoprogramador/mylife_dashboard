// @ts-nocheck

import { ForecastBalance } from "@/components/ForecastBalance";
import { useState, useEffect, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { format, differenceInDays } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useTheme } from "next-themes";

export default function Resume() {
  const [formData, setFormData] = useState({
    today: 2500,
    investments: 20000,
  });

  const handleChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: parseFloat(value),
    }));
  };

  const [expensesData, setExpensesData] = useState({
    energy: 150,
    energyAvg: 125,
    water: 150,
    waterAvg: 125,
  });

  const [creditCardNubank, setCreditCardNubank] = useState(650);
  const [creditCardNubankLimit, setCreditCardNubankLimit] = useState(1000);

  const [creditCardSantander, setCreditCardSantander] = useState(250);
  const [creditCardSantanderLimit, setCreditCardSantanderLimit] = useState(280);

  const [creditCardAvg, setCreditCardAvg] = useState(1100);

  const [paycheck, setPaycheck] = useState(3500);
  const [stocksInvestiment, setStocksInvestiment] = useState(500);
  const [stocksInvestimentAvg, setStocksInvestimentAvg] = useState(300);

  const totalBalance =
    parseFloat(formData.today) + parseFloat(formData.investments);

  const [energy, setEnergy] = useState(150);
  const [water, setWater] = useState(125);

  const [energyAvg, setEnergyAvg] = useState(150);
  const [waterAvg, setWaterAvg] = useState(100);

  const totalCurrent = parseFloat(energy) + parseFloat(water);
  const totalAverage = parseFloat(energyAvg) + parseFloat(waterAvg);

  const totalCardsCurrent =
    parseFloat(creditCardNubank) + parseFloat(creditCardSantander);
  const totalCardsLimits =
    parseFloat(creditCardNubankLimit) + parseFloat(creditCardSantanderLimit);

  const total = new Intl.NumberFormat("pt-BR", {
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

  const investmentsOfMonth = stocksInvestiment + formData.investments;

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-slate-600" : "bg-blue-600";
  const bgColorTotals = theme === "dark" ? "bg-gray-900" : "bg-white";

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            <div className="flex flex-1 justify-evenly items-center">
              <div className="font-bold text-white text-base">
                Total Patrimônio Hoje
              </div>
              <div
                className={`${bgColorTotals} rounded-lg flex p-1 px-3 justify-center`}
              >
                {total}
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
            <div className="flex flex-1 items-center">
              <div className="font-bold text-white text-sm justify-center flex flex-1">
                Conta de Luz
              </div>
              <div>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={energy}
                  className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                  onValueChange={(values) => {
                    setEnergy(parseFloat(values.floatValue));
                  }}
                />
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={energyAvg}
                  className="rounded-lg p-2 text-sm w-20 text-center"
                  onValueChange={(values) => {
                    setEnergyAvg(parseFloat(values.floatValue));
                  }}
                />
              </div>
            </div>
            <div className="flex flex-1 justify-between items-center">
              <div className="font-bold text-white text-sm text-end justify-center flex flex-1">
                Conta de Água
              </div>
              <div>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={water}
                  className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                  onValueChange={(values) => {
                    setWater(parseFloat(values.floatValue));
                  }}
                />
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={waterAvg}
                  className="rounded-lg p-2 text-sm w-20 text-center"
                  onValueChange={(values) => {
                    setWaterAvg(parseFloat(values.floatValue));
                  }}
                />
              </div>
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
            <div className="flex justify-between items-center">
              <div className="font-bold text-white text-base">NuBank</div>
              <div>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={creditCardNubank}
                  className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                  onValueChange={(values) => {
                    setCreditCardNubank(parseFloat(values.floatValue));
                  }}
                />
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={creditCardNubankLimit}
                  className="rounded-lg p-2 text-sm w-20 text-center"
                  onValueChange={(values) => {
                    setCreditCardNubankLimit(parseFloat(values.floatValue));
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="font-bold text-white text-base mb-2">
                Santander
              </div>
              <div>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={creditCardSantander}
                  className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                  onValueChange={(values) => {
                    setCreditCardSantander(parseFloat(values.floatValue));
                  }}
                />
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  allowNegative={false}
                  value={creditCardSantanderLimit}
                  className="rounded-lg p-2 text-sm w-20 text-center"
                  onValueChange={(values) => {
                    setCreditCardSantanderLimit(parseFloat(values.floatValue));
                  }}
                />
              </div>
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
