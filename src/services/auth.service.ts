import apiClient from "@/lib/api-client";
import type { LoginFormValues, AuthResponse } from "@/types/auth.types";

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    // DummyJSON login endpoint
    const response = await apiClient.post("/auth/login", {
      username: credentials.username,
      password: credentials.password,
    });

    return {
      user: {
        id: response.data.id,
        name: `${response.data.firstName} ${response.data.lastName}`,
        email: response.data.email,
        username: response.data.username,
        image: response.data.image,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  refreshToken: async (token: string) => {
    const response = await apiClient.post("/auth/refresh", {
      refreshToken: token,
    });
    return response.data;
  },
};
