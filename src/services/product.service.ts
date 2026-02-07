import api from "@/lib/api-client";
import type { Product, Category } from "@/types/product.types";

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const productService = {
  getProducts: async (limit = 10, skip = 0) => {
    const response = await api.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get<ProductsResponse>(
      `/products/search?q=${query}`,
    );
    return response.data;
  },

  getProductsByCategory: async (category: string) => {
    const response = await api.get<ProductsResponse>(
      `/products/category/${category}`,
    );
    return response.data;
  },

  getProductById: async (id: number | string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  addProduct: async (product: Omit<Product, "id">) => {
    const response = await api.post<Product>("/products/add", product);
    return response.data;
  },

  updateProduct: async (id: number | string, product: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number | string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Category Operations (Simulated for Demo)
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<string[] | Category[]>(
      "/products/categories",
    );
    // DummyJSON returns strings, mapped to objects if needed
    if (response.data.length > 0 && typeof response.data[0] === "string") {
      return (response.data as unknown as string[]).map((cat) => ({
        slug: cat,
        name: cat
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        url: `/products/category/${cat}`,
      }));
    }
    return response.data as Category[];
  },

  addCategory: async (category: Category) => {
    // Simulated API call
    return new Promise<Category>((resolve) => {
      setTimeout(() => resolve(category), 500);
    });
  },

  updateCategory: async (_slug: string, category: Category) => {
    // Simulated API call
    return new Promise<Category>((resolve) => {
      setTimeout(() => resolve(category), 500);
    });
  },

  deleteCategory: async (_slug: string) => {
    // Simulated API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },
};

export default productService;
