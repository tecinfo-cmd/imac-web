import { useContext } from "react";

import { AuthContext, AuthContextProps } from "./provider";

export function useAuthContext() {
  const context = useContext(AuthContext) as AuthContextProps;

  return context;
}