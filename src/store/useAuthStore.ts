import { authControllerLogin, authControllerRegister } from "@/services/svg/renzheng";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const USER_INFO_KEY = "auth-storage";

interface AuthState {
  user: API.UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: API.LoginDto) => Promise<void>;
  register: (data: API.RegisterDto) => Promise<void>;
  logout: () => void;
  setUser: (user: API.UserData) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // get
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: API.UserData) => set({ user, isAuthenticated: true }),
      setToken: (token: string) => set({ token }),

      login: async (data: API.LoginDto) => {
        set({ isLoading: true });
        try {
          const response = await authControllerLogin(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: AnyIfEmpty) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: API.RegisterDto) => {
        set({ isLoading: true });
        try {
          const response = await authControllerRegister({
            ...data,
            inviteCode: localStorage.getItem("inviteCode") || undefined,
          });
          if (response.user.isInvited) {
            localStorage.removeItem("inviteCode");
          }
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: AnyIfEmpty) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: USER_INFO_KEY,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
