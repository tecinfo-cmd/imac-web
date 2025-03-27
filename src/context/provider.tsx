"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { SignInCredentials, useSignIn } from "../hooks/useAuth/useSignIn";

export interface AuthContextProps {
  handleSignIn: (credentials: SignInCredentials) => void;
  signOut: () => void;
  isPending: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const { mutateAsync: signIn, isPending } = useSignIn();
  const { setUserData, clearSession } = useAuthStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const { "@IMAC:T": access_token } = parseCookies();

    if (access_token) {
      api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      const fetchUserData = async () => {
        try {
          if (email) {
            const { data } = await api.get(`/usuario/email/${email}`);
            setUserData(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserData();
    }
  }, [email, setUserData]);

  const handleSignIn = useCallback(
    async ({ email, senha }: SignInCredentials) => {
      try {
        const data = await signIn({ email, senha });
        console.log(data);
        const { access_token } = data;

        setCookie(undefined, "@IMAC:T", access_token, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        setEmail(email);
        router.push("/dashboard");
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      } catch (error) {
        console.error(error);
      }
    },
    [router, signIn]
  );

  const signOut = useCallback(() => {
    destroyCookie(undefined, "@IMAC:T");
    clearSession();
    router.push("/auth");
  }, [clearSession, router]);

  const cachedValue = useMemo(() => {
    return {
      handleSignIn,
      isPending,
      signOut,
    };
  }, [handleSignIn, isPending, signOut]);

  return (
    <AuthContext.Provider value={cachedValue}>{children}</AuthContext.Provider>
  );
}
