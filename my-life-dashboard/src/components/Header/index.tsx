import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";

export function Header() {
  const { user } = useContext(AuthContext);
  // console.log(user);

  return (
    <header className=" bg-gradient-to-r from-blue-500 from-20% via-blue-600 via-30% to-blue-600 flex items-center justify-between p-4 text-white rounded-br-2xl">
      <div className="flex  items-center">
        <Image
          src={user?.avatar_url}
          width={50}
          height={50}
          style={{ objectFit: "contain", borderRadius: "20px" }}
          alt="thumbnail"
        />
        <h1 className="ml-4">Olá {user?.name}, seja bem vindo!</h1>
      </div>
      <Link href="/" className="flex flex-row cursor-pointer">
        <RiLogoutBoxRLine className="mr-1" size={25} />
        <button>Logout</button>
      </Link>
    </header>
  );
}
