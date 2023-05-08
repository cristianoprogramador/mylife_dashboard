import { AuthContext } from "@/contexts/AuthContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";

export function Header() {
  // Aqui você pode definir as informações de login do usuário, como a foto e o nome
  // const userTest = {
  //   name: "Cristiano",
  //   avatar_url: "https://avatars.githubusercontent.com/u/102186472?v=4",
  // };
  // const { user } = useContext(AuthContext);
  // console.log(user);

  const { data: session } = useSession();

  return (
    <header className=" bg-gradient-to-r from-blue-500 from-20% via-blue-600 via-30% to-blue-600 flex items-center justify-between p-4 text-white rounded-br-2xl">
      <div className="flex  items-center">
        {session?.user?.image ? (
          <>
            <Image
              src={session?.user?.image}
              width={50}
              height={50}
              style={{ objectFit: "contain", borderRadius: "20px" }}
              alt="thumbnail"
            />
            <h1 className="ml-4">Olá {session?.user?.name}, seja bem vindo!</h1>
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
