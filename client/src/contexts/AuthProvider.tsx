import React, { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Auth {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export interface UsersContextType {
  auth: Auth;
  setAuth: (user: Auth) => void;
}

const AuthContext = React.createContext({} as UsersContextType);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState({} as Auth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
