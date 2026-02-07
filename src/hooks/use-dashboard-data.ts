import { useState, useEffect } from "react";
import type { Product } from "@/types/product.types";
import type { User } from "@/types/user.types";
import productService from "@/services/product.service";

import { toast } from "sonner";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStockItems: 0,
    averagePrice: 0,
    averageRating: 0,
    categoriesCount: 0,
  });

  const [chartData, setChartData] = useState<{
    productsByCategory: { name: string; value: number }[];
    priceRangeDistribution: { name: string; value: number }[];
    topRatedProducts: { name: string; rating: number; price: number }[];
  }>({
    productsByCategory: [],
    priceRangeDistribution: [],
    topRatedProducts: [],
  });

  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real products from API
        const productsResponse = await productService.getProducts(100, 0);
        const products = productsResponse.products;

        // Mock users data (since we don't have a users API)
        const users: User[] = Array.from({ length: 25 }).map((_, i) => ({
          id: i + 1,
          firstName: `User`,
          lastName: `${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: 20 + i,
          gender: i % 2 === 0 ? "male" : "female",
          username: `user${i + 1}`,
          password: "password",
          image: `https://dummyjson.com/icon/user/${i + 1}`,
          birthDate: "2000-01-01",
          phone: "123-456-7890",
        }));

        // 1. Calculate Stats
        const totalProducts = products.length;
        const totalUsers = users.length;
        const lowStockItems = products.filter((p) => p.stock < 10).length;
        const averagePrice =
          products.reduce((acc, p) => acc + p.price, 0) / totalProducts;
        const averageRating =
          products.reduce((acc, p) => acc + p.rating, 0) / totalProducts;
        const categories = [...new Set(products.map((p) => p.category))];
        const categoriesCount = categories.length;

        setStats({
          totalProducts,
          totalUsers,
          lowStockItems,
          averagePrice: Math.round(averagePrice),
          averageRating: Number(averageRating.toFixed(1)),
          categoriesCount,
        });

        // 2. Prepare Chart Data

        // Products by Category
        const categoryMap = products.reduce(
          (acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const productsByCategoryRaw = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        const topCategories = productsByCategoryRaw.slice(0, 5);
        const otherCategories = productsByCategoryRaw.slice(5);

        const productsByCategory = [...topCategories];
        if (otherCategories.length > 0) {
          const otherValue = otherCategories.reduce(
            (acc, cat) => acc + cat.value,
            0,
          );
          productsByCategory.push({ name: "Other", value: otherValue });
        }

        // Price Range Distribution
        const priceRanges = {
          "₹0-500": 0,
          "₹500-1000": 0,
          "₹1000-2000": 0,
          "₹2000+": 0,
        };

        products.forEach((p) => {
          if (p.price <= 500) priceRanges["₹0-500"]++;
          else if (p.price <= 1000) priceRanges["₹500-1000"]++;
          else if (p.price <= 2000) priceRanges["₹1000-2000"]++;
          else priceRanges["₹2000+"]++;
        });

        const priceRangeDistribution = Object.entries(priceRanges).map(
          ([name, value]) => ({ name, value }),
        );

        // Top 10 Rated Products
        const topRatedProducts = [...products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10)
          .map((p) => ({
            name: p.title,
            rating: p.rating,
            price: p.price,
          }));

        setChartData({
          productsByCategory,
          priceRangeDistribution,
          topRatedProducts,
        });

        // 3. Recent Products
        setRecentProducts([...products].slice(0, 5));
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, stats, chartData, recentProducts };
}
