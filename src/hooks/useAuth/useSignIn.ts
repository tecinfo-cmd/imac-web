import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";


export interface SignInCredentials {
  email: string
  senha: string
}

export interface Session {
  email: string
  accessToken: string
}

export const signInRequest = async (credentials: SignInCredentials) => {
  try {
    const { data } = await api.post<Session>("/auth/login", credentials);
    return data;
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const useSignIn = () => {
  return useMutation<Session, AxiosError, SignInCredentials>({
    mutationFn: signInRequest,

  });
};