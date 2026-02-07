import { useQuery } from "@tanstack/react-query";
import productService from "@/services/product.service";

interface UseProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
}

export const useProducts = ({
  limit = 10,
  skip = 0,
  search = "",
  category = "",
}: UseProductsParams) => {
  return useQuery({
    queryKey: ["products", { limit, skip, search, category }],
    queryFn: async () => {
      if (search) {
        // Search endpoint
        return productService.searchProducts(search);
      }
      if (category) {
        // Category endpoint
        return productService.getProductsByCategory(category);
      }
      // Default list endpoint
      return productService.getProducts(limit, skip);
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: productService.getCategories,
  });
};

export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};
