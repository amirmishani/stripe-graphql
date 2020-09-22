import React, { createContext } from "react";

export interface UserProps {
  id: number;
  email: string;
  password: string;
  customerId: string | null;
  paymentId: string | null;
  plan: string;
}

export interface UserContextProps {
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

export const UserContext = createContext<UserContextProps | null>(null);
