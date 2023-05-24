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

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Define a largura limite para considerar como tela pequena
    };

    window.addEventListener("resize", handleResize);

    // Verifica o tamanho da tela quando o componente é montado
    handleResize();

    // Remove o evento de redimensionamento quando o componente é desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(
        //   `http://localhost:3030/spending_history/${session?.user?.email}`
        // );
        // const responseData = response.data;
        const response = await fetch(
          `/api/spending_history?email=${session?.user?.email}`
        );
        const responseData = await response.json();

        setRowData(responseData.reverse());
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [session]);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`flex flex-1 flex-col transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Head>
          <title>Análise Gráfica dos Gastos</title>
        </Head>
        <div className="flex flex-col lg:flex-row justify-around align-middle w-full">
          <MonthlySpendingChart
            expenses={rowData}
            isSmallScreen={isSmallScreen}
          />
          <ExpenseByCategory expenses={rowData} isSmallScreen={isSmallScreen} />
        </div>
        <div className="flex flex-col lg:flex-row justify-around align-middle w-full">
          <PieChart expenses={rowData} isSmallScreen={isSmallScreen} />
          <StackedBarChart expenses={rowData} isSmallScreen={isSmallScreen} />
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
