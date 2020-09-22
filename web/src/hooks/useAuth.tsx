// Hook (use-auth.js)
import React, { useState, useEffect, useContext, createContext } from "react";
import { useQuery } from "@apollo/client";
import { meQuery } from "../graphql/queries";

export interface UserProps {
  id: number;
  email: string;
  password: string;
  customerId: string | null;
  paymentId: string | null;
  plan: string;
}

export type AuthContextUser = UserProps | null;

interface AuthContext {
  user: AuthContextUser;
  updateUser: (user: AuthContextUser) => void;
  isLoaded: boolean;
}

const authContext = createContext<AuthContext>({
  user: null,
  updateUser: (user) => {},
  isLoaded: false,
});

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<AuthContextUser>(null);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const { data, error } = useQuery(meQuery);

  const updateUser = (user: AuthContextUser) => setUser(user);

  useEffect(() => {
    if (data) {
      setLoaded(true);
      if (data.me) {
        setUser(data.me);
      }
    }

    if (error) {
      setLoaded(true);
    }
  }, [data, error, setLoaded]);

  return {
    user,
    updateUser,
    isLoaded,
  };
}
