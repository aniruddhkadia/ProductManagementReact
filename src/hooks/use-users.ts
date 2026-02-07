import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";

interface UseUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
}

export const useUsers = ({
  limit = 10,
  skip = 0,
  search = "",
}: UseUsersParams) => {
  return useQuery({
    queryKey: ["users", { limit, skip, search }],
    queryFn: () => {
      if (search) {
        return userService.searchUsers(search);
      }
      return userService.getUsers(limit, skip);
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (id: number | string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};
