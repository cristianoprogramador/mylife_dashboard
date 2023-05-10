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
  const [isLoading, setIsLoading] = useState(true);
  const [dataProfile, setDataProfile] = useState<ProfileProps | null>(null);

  useEffect(() => {
    async function fetchDataProfile() {
      const dataProfile = await getUserDataProfile();
      setDataProfile(dataProfile);
      setIsLoading(false);
    }
    fetchDataProfile();
  }, []);

  async function getUserDataProfile() {
    const dataProfile =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userData") || "null")
        : null;

    if (dataProfile) {
      return dataProfile;
    } else if (session) {
      try {
        const { data } = await axios.get(
          `/api/users?email=${session?.user?.email}`
        );
        localStorage.setItem("userData", JSON.stringify(data));
        return data;
      } catch (error: any) {
        console.log(error.response?.data);
        return null;
      }
    }
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("userData");
    signOut();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header className=" bg-gradient-to-r from-blue-500 from-20% via-blue-600 via-30% to-blue-600 flex items-center justify-between p-4 text-white rounded-br-2xl">
      <div className="flex items-center">
        {dataProfile ? (
          <>
            <div className="flex justify-center h-14 w-14">
              <Image
                src={dataProfile?.image}
                width={50}
                height={50}
                style={{ borderRadius: "25px", objectFit: "cover" }}
                alt="thumbnail"
              />
            </div>
            <div>
              <h1 className="ml-4">Olá {dataProfile?.name}, seja bem vindo!</h1>
            </div>
          </>
        ) : (
          <div>
            <h1 className="ml-4">Olá, entre com sua conta!</h1>
          </div>
        )}
      </div>
      <Link href="/" className="flex flex-row cursor-pointer">
        <RiLogoutBoxRLine className="mr-1" size={25} />
        <button onClick={handleLogout}>Logout</button>
      </Link>
    </header>
  );
}
