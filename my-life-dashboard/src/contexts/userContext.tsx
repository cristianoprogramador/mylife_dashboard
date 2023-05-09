import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

type User = {
  name: string;
  image: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { data: session } = useSession();

  console.log("TA NO CONTEXT", user);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `/api/users?email=${session?.user?.email}`
      );
      setUser(data);
      localStorage.setItem("userData", JSON.stringify(data));
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    if (isFirstLoad) {
      fetchUser();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
