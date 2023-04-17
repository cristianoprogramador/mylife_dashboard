import { useState } from "react";
import { NumericFormat } from "react-number-format";

export default function Resume() {
  const [today, setToday] = useState(2500);
  const [investments, setInvestments] = useState(20000);

  const [creditCard, setCreditCard] = useState(2400);
  const [paycheck, setPaycheck] = useState(3500);

  const totalBalance = parseFloat(today) + parseFloat(investments);

  const [energy, setEnergy] = useState(150);
  const [water, setWater] = useState(100);
  const [condom, setCondom] = useState(450);
  const [cleaning, setCleaning] = useState(130);
  const [internet, setInternet] = useState(100);
  const [phone, setPhone] = useState(100);

  const [energyAvg, setEnergyAvg] = useState(150);
  const [waterAvg, setWaterAvg] = useState(100);
  const [condomAvg, setCondomAvg] = useState(450);
  const [cleaningAvg, setCleaningAvg] = useState(130);
  const [internetAvg, setInternetAvg] = useState(100);
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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-row gap-4">
        {/* Primeiro Bloco */}
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-4 w-2/4">
          <div className="font-bold text-white text-xl mb-2 text-center ">
            Status Geral
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">
              Conta Corrente
            </div>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              value={today}
              className="rounded-lg p-2 text-center w-36"
              onValueChange={(values) => {
                setToday(parseFloat(values.floatValue));
              }}
            />
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">
              Investimentos / Cripto
            </div>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              value={investments}
              className="rounded-lg p-2 text-center w-36"
              onValueChange={(values) => {
                setInvestments(parseFloat(values.floatValue));
              }}
            />
          </div>
          <div className="flex flex-1 justify-evenly items-center">
            <div className="font-bold text-white text-lg mb-2">
              Total Patrimônio Hoje
            </div>
            <div className="bg-white rounded-lg flex p-3 w-30  justify-center">
              {total}
            </div>
          </div>
        </div>
        {/* Segundo Bloco */}
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-4 w-2/4">
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-xl mb-2 text-center">
              Data Hoje
            </div>
            <input type="date" />
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-xl mb-2 text-center">
              Data Final Mês
            </div>
            <input type="date" />
          </div>
        </div>
      </div>
      {/* Terceiro Bloco */}
      <div className="flex flex-1 flex-row gap-4">
        <div className="bg-blue-600 rounded-lg p-4 flex flex-col gap-4 w-2/4">
          <div className="font-bold text-white text-xl mb-2 text-center">
            Contas do Mês x Média Anual
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">
              Conta de Luz
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={energy}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setEnergyAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">
              Conta de Água
            </div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={water}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setWaterAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">Condominio</div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={condom}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setCondomAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">Faxineira</div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={cleaning}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setCleaningAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">Internet</div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={internet}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setInternetAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-lg mb-2">Telefone</div>
            <div>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowNegative={false}
                value={phone}
                className="rounded-lg p-2 text-center w-24 mr-6"
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
                className="rounded-lg p-2 text-center w-24"
                onValueChange={(values) => {
                  setPhoneAvg(parseFloat(values.floatValue));
                }}
              />
            </div>
          </div>
          <div className="flex flex-1 justify-between items-center">
            <div className="font-bold text-white text-2xl text-center mb-2">
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
        {/* Quarto Bloco */}
        <div className="bg-gray-400  rounded-lg p-4 flex flex-col gap-4 w-2/4">
          <div className="font-bold text-white text-lg mb-2">Em construção</div>
        </div>
      </div>
      <div className="bg-blue-800  rounded-lg p-4 flex flex-col gap-4 w-2/4">
        <div className="flex flex-1 justify-between items-center">
          <div className="font-bold text-white text-lg mb-2">
            Cartão de Crédito
          </div>
          <div>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              value={creditCard}
              className="rounded-lg p-2 text-center w-24 mr-6"
              onValueChange={(values) => {
                setCreditCard(parseFloat(values.floatValue));
              }}
            />
          </div>
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="font-bold text-white text-lg mb-2">
            Salário Liquido
          </div>
          <div>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowNegative={false}
              value={paycheck}
              className="rounded-lg p-2 text-center w-24 mr-6"
              onValueChange={(values) => {
                setPaycheck(parseFloat(values.floatValue));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
