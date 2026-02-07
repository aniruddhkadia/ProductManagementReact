import api from "../lib/axios";
import type { Product } from "../types";

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

  getCategories: async () => {
    const response = await api.get<string[]>("/products/categories");
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
};

export default productService;
