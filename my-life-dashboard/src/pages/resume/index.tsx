import { ForecastBalance } from "@/components/ForecastBalance";
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { format, differenceInDays } from "date-fns";

export default function Resume() {
  const [today, setToday] = useState(2500);
  const [investments, setInvestments] = useState(20000);

  const [creditCardNubank, setCreditCardNubank] = useState(650);
  const [creditCardNubankLimit, setCreditCardNubankLimit] = useState(1000);

  const [creditCardSantander, setCreditCardSantander] = useState(250);
  const [creditCardSantanderLimit, setCreditCardSantanderLimit] = useState(280);

  const [creditCardAvg, setCreditCardAvg] = useState(1100);

  const [paycheck, setPaycheck] = useState(3500);
  const [stocksInvestiment, setStocksInvestiment] = useState(500);
  const [stocksInvestimentAvg, setStocksInvestimentAvg] = useState(300);

  const totalBalance = parseFloat(today) + parseFloat(investments);

  const [energy, setEnergy] = useState(150);
  const [water, setWater] = useState(125);
  const [condom, setCondom] = useState(450);
  const [cleaning, setCleaning] = useState(130);
  const [internet, setInternet] = useState(80);
  const [phone, setPhone] = useState(100);

  const [energyAvg, setEnergyAvg] = useState(150);
  const [waterAvg, setWaterAvg] = useState(100);
  const [condomAvg, setCondomAvg] = useState(450);
  const [cleaningAvg, setCleaningAvg] = useState(130);
  const [internetAvg, setInternetAvg] = useState(80);
  const [phoneAvg, setPhoneAvg] = useState(100);

  const totalCurrent =
    parseFloat(energy) +
    parseFloat(water) +
    parseFloat(condom) +
    parseFloat(cleaning) +
    parseFloat(internet) +
    parseFloat(phone);
  const totalAverage =
    parseFloat(energyAvg) +
    parseFloat(waterAvg) +
    parseFloat(condomAvg) +
    parseFloat(cleaningAvg) +
    parseFloat(internetAvg) +
    parseFloat(phoneAvg);

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

  function getDaysRemaining() {
    const today = new Date(format(new Date(), "yyyy-MM-dd"));
    const final = new Date(finalDate);
    const diffDays = differenceInDays(final, today);
    return diffDays;
  }

  function handleChangeFinalDate(event) {
    console.log("UE", event.target.value);
    setFinalDate(event.target.value);
  }

  const [daysRemaining, setDaysRemaining] = useState(getDaysRemaining());

  useEffect(() => {
    setDaysRemaining(getDaysRemaining());
  }, [finalDate]);

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
    today - totalCurrent - totalCardsLimits + paycheck - stocksInvestiment;

  const currentAccountAvg = totalAverage + stocksInvestimentAvg + creditCardAvg;

  const investmentsOfMonth = stocksInvestiment + investments;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2 p-2">
        {/* Primeiro Bloco */}
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col w-96">
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
              value={today}
              className="rounded-lg p-1 text-center w-28"
              onValueChange={(values) => {
                setToday(parseFloat(values.floatValue));
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
              value={investments}
              className="rounded-lg p-1 text-center w-28"
              onValueChange={(values) => {
                setInvestments(parseFloat(values.floatValue));
              }}
            />
          </div>
          <div className="flex flex-1 justify-evenly items-center">
            <div className="font-bold text-white text-base">
              Total Patrimônio Hoje
            </div>
            <div className="bg-white rounded-lg flex p-1  justify-center">
              {total}
            </div>
          </div>
        </div>
        {/* Segundo Bloco */}
        <div className="bg-blue-600 rounded-lg  flex flex-col gap-2 w-96 p-4">
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
              <div className="bg-white p-3 rounded-lg">{formattedValue}</div>
            </div>
            <div className="flex flex-1 justify-center items-center flex-col">
              <div className="font-bold text-white text-base mb-2 text-center ">
                Valor por Dia
              </div>
              <div className="bg-white p-3 rounded-lg">
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
      <div className="flex flex-row gap-2 p-2">
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-3 w-80">
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
            <div className="font-bold text-white text-sm text-end justify-center flex flex-1">
              Condominio
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={condom}
                className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                onValueChange={(values) => {
                  setCondom(parseFloat(values.floatValue));
                }}
              />
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={condomAvg}
                className="rounded-lg p-2 text-sm w-20 text-center"
                onValueChange={(values) => {
                  setCondomAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-sm text-end justify-center flex flex-1">
              Faxineira
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={cleaning}
                className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                onValueChange={(values) => {
                  setCleaning(parseFloat(values.floatValue));
                }}
              />
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={cleaningAvg}
                className="rounded-lg p-2 text-sm w-20 text-center"
                onValueChange={(values) => {
                  setCleaningAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-sm text-end justify-center flex flex-1">
              Internet
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={internet}
                className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                onValueChange={(values) => {
                  setInternet(parseFloat(values.floatValue));
                }}
              />
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={internetAvg}
                className="rounded-lg p-2 text-sm w-20 text-center"
                onValueChange={(values) => {
                  setInternetAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-sm text-end justify-center flex flex-1">
              Telefone
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={phone}
                className="rounded-lg p-2 text-sm w-20 mr-6 text-center"
                onValueChange={(values) => {
                  setPhone(parseFloat(values.floatValue));
                }}
              />
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={phoneAvg}
                className="rounded-lg p-2 text-sm w-20 text-center"
                onValueChange={(values) => {
                  setPhoneAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>

          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg justify-center flex flex-1">
              Total
            </div>
            <div className="flex gap-2 flex-row">
              <div className="bg-white rounded-lg flex p-3 w-30  justify-center">
                {totalCurrentFormatted}
              </div>
              <div className="bg-white rounded-lg flex p-3 w-30  justify-center">
                {totalAverageFormatted}
              </div>
            </div>
          </div>
        </div>
        {/* AQUI */}
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-3 w-96">
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
            <div className="font-bold text-white text-base mb-2">Santander</div>
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
              <div className="bg-white rounded-lg flex p-3 w-30  justify-center">
                {totalCardsCurrentFormatted}
              </div>
              <div className="bg-white rounded-lg flex p-3 w-30  justify-center">
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
          <div className="bg-blue-800 rounded-lg p-4 flex flex-col gap-3">
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
                    className="rounded-lg p-2 text-center w-20  flex justify-center align-middle"
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
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-3">
          <ForecastBalance
            month={finalDate}
            currentAccount={currentAccount}
            currentAccountAvg={currentAccountAvg}
            investments={investmentsOfMonth}
            investmentsAvg={stocksInvestimentAvg}
            paycheck={paycheck}
          />
        </div>
        {/* Bloco Bottom */}
      </div>
      {/* <div className="bg-blue-800 rounded-lg p-4 flex flex-col gap-3  ">
        <div className="flex flex-1 justify-center gap-20 items-center">
          <div className="flex  justify-center items-center flex-col">
            <div className="font-bold text-white text-base ">
              Investimento no Mês
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={stocksInvestiment}
                className="rounded-lg p-2 text-center w-20 mr-6"
                onValueChange={(values) => {
                  setStocksInvestiment(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex  justify-center items-center flex-col">
            <div className="font-bold text-white text-base">
              Média Anual de Investimento
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={stocksInvestimentAvg}
                className="rounded-lg p-2 text-center w-20 mr-6"
                onValueChange={(values) => {
                  setStocksInvestimentAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center gap-10 items-center">
          <div className="font-bold text-white text-base">Salário Liquido</div>
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
      </div> */}
    </div>
  );
}
