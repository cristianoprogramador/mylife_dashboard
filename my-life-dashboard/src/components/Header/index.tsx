import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect, useCallback } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";

interface ProfileProps {
  name: string;
  image: string;
}

export function Header() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [dataProfile, setDataProfile] = useState<ProfileProps | null>(null);
  const { theme, setTheme } = useTheme();

  const getUserDataProfile = useCallback(async () => {
    const dataProfile =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("userData") || "null")
        : null;

    if (dataProfile) {
      return dataProfile;
    } else if (session) {
      try {
        const response = await axios.get(
          `http://localhost:3030/userData/${session?.user?.email}`
        );

        const responseData = response.data;

        localStorage.setItem("userData", JSON.stringify(responseData));
        return console.log("Conectado");
      } catch (error: any) {
        console.log(error.response?.data);
        return null;
      }
    }
    return null;
  }, [session]);

  useEffect(() => {
    async function fetchDataProfile() {
      const dataProfile = await getUserDataProfile();
      setDataProfile(dataProfile);
      setIsLoading(false);
    }
    fetchDataProfile();
  }, [getUserDataProfile]);

  const handleChange = (option: string) => {
    setTheme(option);
  };

  function handleLogout() {
    localStorage.removeItem("userData");
    signOut();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header
      className={`bg-gradient-to-r ${
        theme === "dark"
          ? "from-gray-800 from-20% via-gray-900 to-black"
          : "from-blue-500 from-20% via-blue-600 via-30% to-blue-600"
      } flex items-center justify-between p-4 text-white rounded-br-2xl`}
    >
      <div className="flex items-center">
        {dataProfile ? (
          <>
            <div className="flex justify-center h-14 w-14">
              <Image
                src={dataProfile?.image}
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
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
      <Link href="/" className="flex flex-row mr-2">
        {theme === "dark" ? (
          <MdOutlineNightlight
            className="mr-8"
            size={25}
            onClick={() => handleChange("light")}
          />
        ) : (
          <MdOutlineLightMode
            className="mr-8"
            size={25}
            onClick={() => handleChange("dark")}
          />
        )}
        <RiLogoutBoxRLine className="mr-1" size={25} />
        <button onClick={handleLogout}>Logout</button>
      </Link>
    </header>
  );
}
