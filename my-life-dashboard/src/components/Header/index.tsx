import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";

interface ProfileProps {
  name: string;
  image: string;
}

export function Header() {
  const { data: session } = useSession();
  // console.log(session?.user?.image);
  // const [userData, setUserData] = useState<ProfileProps | null>(null);

  const dataProfile = JSON.parse(localStorage.getItem("userData") || "null");
  // console.log(dataProfile);

  return (
    <header className=" bg-gradient-to-r from-blue-500 from-20% via-blue-600 via-30% to-blue-600 flex items-center justify-between p-4 text-white rounded-br-2xl">
      <div className="flex  items-center">
        {dataProfile ? (
          <>
            <Image
              src={dataProfile?.image}
              width={50}
              height={50}
              style={{ borderRadius: "25px" }}
              alt="thumbnail"
            />
            <h1 className="ml-4">Olá {dataProfile?.name}, seja bem vindo!</h1>
          </>
        ) : (
          <h1 className="ml-4">Olá, entre com sua conta!</h1>
        )}
      </div>
      <Link href="/" className="flex flex-row cursor-pointer">
        <RiLogoutBoxRLine className="mr-1" size={25} />
        <button onClick={() => signOut()}>Logout</button>
      </Link>
    </header>
  );
}
