import MonthlySpendingChart from "@/components/MonthlySpendingChart";
import PieChart from "@/components/PieChart";
import StackedBarChart from "@/components/StackedBarChart";
import ExpenseByCategory from "@/components/TypeOfSpendingChart";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";

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

export default function Analysis() {
  const { data: session } = useSession();
  const [rowData, setRowData] = useState<SpendingHistoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/spending_history/${session?.user?.email}`
        );
        const responseData = await response.json();
        // const response = await axios.get(
        //   `http://localhost:3030/spending_history/${session?.user?.email}`
        // );
        // const responseData = response.data;

        setRowData(responseData.reverse());
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [session]);

  // console.log(rowData);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`flex flex-1 flex-col transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Head>
        <title>Análise Grafica dos Gastos</title>
      </Head>
      <div className="flex flex-row justify-around align-middle w-full">
        <MonthlySpendingChart expenses={rowData} />
        <ExpenseByCategory expenses={rowData} />
      </div>
      <div className="flex flex-row justify-around align-middle w-full">
        <PieChart expenses={rowData} />
        <StackedBarChart expenses={rowData} />
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
