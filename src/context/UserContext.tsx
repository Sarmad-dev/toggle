"use client"

"use client";

import { getUser } from "@/lib/actions/user";
import queryClient from "@/lib/tanstack/queryClient";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type UserType = Awaited<ReturnType<typeof getUser>>;

interface UserContextType {
  user: UserType | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      setUser(userData);
      queryClient.setQueryData(["user"], userData);
    } catch (err) {
      console.error("Error fetching user:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, isError, refetch: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside <UserProvider />");
  return ctx;
};
