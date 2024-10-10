import { baseApi } from "@/services/baseApi";
import { User } from "../constants/types";

export const signup = async (email: string, password: string) => {
  return baseApi.post<User>('users/signup', { email, password }).then(res => res.data);
}

export const login = async (email: string, password: string) => {
  return baseApi.post<User>('users/login', { email, password }).then(res => res.data);
}

export const logout = async () => {
  return baseApi.delete('users/logout');
}

export const getLoggedInUser = async () => {
  return baseApi.get<User | null>('users/session').then(res => res.data ?? null);
}
