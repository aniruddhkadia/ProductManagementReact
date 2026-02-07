import api from "@/lib/api-client";
import type { User } from "@/types/user.types";

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const userService = {
  getUsers: async (limit = 10, skip = 0) => {
    const response = await api.get<UsersResponse>(
      `/users?limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get<UsersResponse>(`/users/search?q=${query}`);
    return response.data;
  },

  getUserById: async (id: number | string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

export default userService;
