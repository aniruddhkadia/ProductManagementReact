import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginFormValues } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, accessToken } = await authService.login(credentials);
          localStorage.setItem("access_token", accessToken);
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw err;
        }
      },
      logout: () => {
        authService.logout();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      setAuth: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

// Convenience hook
export const useAuth = () => {
  const auth = useAuthStore();
  return {
    ...auth,
    login: auth.login,
    logout: auth.logout,
  };
};
