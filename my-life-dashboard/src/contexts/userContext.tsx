import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface UserProviderProps {
  children: React.ReactNode;
}

type User = {
  name: string;
  image: string;
  toggleTheme: () => void;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  theme: string;
  toggleTheme: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  theme: "light",
  toggleTheme: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  console.log("NO CONTEXT", theme);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
