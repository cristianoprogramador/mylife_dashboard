import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useContext } from "react";

export default function Diary() {
  return <div>Aqui jás seu Diario InterEstelar</div>;
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
