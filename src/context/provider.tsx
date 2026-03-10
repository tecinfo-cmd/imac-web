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
import { setUnauthorizedCallback } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import { jwtDecode } from "jwt-decode";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "sonner";

import { SignInCredentials, useSignIn } from "../hooks/useAuth/useSignIn";

interface DecodedToken {
  roles: string[];
}

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
  const { setRole, clearRole } = useUserRoleStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    setUnauthorizedCallback(() => {
      destroyCookie(undefined, "@IMAC:T");
      clearSession();
      clearRole();
      router.push("/auth");
    });
  }, [clearRole, clearSession, router]);

  useEffect(() => {
    const { "@IMAC:T": accessToken } = parseCookies();

    if (accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

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
        const { accessToken } = data;
        const isProduction = process.env.NODE_ENV === "production";

        setCookie(undefined, "email", data.email, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          secure: isProduction,
          sameSite: "strict",
        });

        setCookie(undefined, "@IMAC:T", accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          secure: isProduction,
          sameSite: "strict",
        });
        setEmail(email);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        const decoded = jwtDecode<DecodedToken>(accessToken);

        const role = decoded.roles?.[0]?.toUpperCase();
        setRole(role);
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        toast.error("Email ou senha inválidos");
      }
    },
    [router, setRole, signIn]
  );

  const signOut = useCallback(() => {
    destroyCookie(undefined, "@IMAC:T");
    destroyCookie(undefined, "email");
    localStorage.clear();
    sessionStorage.clear();
    clearSession();
    clearRole();
    router.push("/auth");
  }, [clearRole, clearSession, router]);

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
