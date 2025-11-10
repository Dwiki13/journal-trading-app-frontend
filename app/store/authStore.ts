import { create } from "zustand";
import api from "@/lib/api";
import { User, LoginPayload } from "../type/auth";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;

  loginUser: (email: string, password: string) => Promise<User>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,

  loginUser: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post(
        "/auth/v1/token?grant_type=password",
        { email, password } as LoginPayload,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY || "",
            "Content-Type": "application/json",
          },
        }
      );

      const token = res.data.access_token; 
      const user = res.data.user;

      set({ token, user });
      localStorage.setItem("token", token ?? "");
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } finally {
      set({ loading: false });
    }
  },
}));
