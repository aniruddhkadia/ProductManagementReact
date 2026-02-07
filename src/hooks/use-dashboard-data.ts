import { useState, useEffect } from "react";
import type { Product, User } from "@/types";

// Mock data service - replacing with actual API calls in a real app
// For now, we'll simulate fetching data

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
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock Data Generation (since we don't have a real backend yet)
        const products: Product[] = Array.from({ length: 50 }).map((_, i) => ({
          id: i + 1,
          title: `Product ${i + 1}`,
          description: `Description for Product ${i + 1}`,
          price: Math.floor(Math.random() * 2500) + 100,
          discountPercentage: Math.floor(Math.random() * 20),
          rating: Number((Math.random() * 2 + 3).toFixed(1)),
          stock: Math.floor(Math.random() * 100),
          brand: `Brand ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
          category: ["Electronics", "Clothing", "Home", "Books", "Toys"][
            Math.floor(Math.random() * 5)
          ],
          thumbnail: "https://placehold.co/100",
          images: ["https://placehold.co/200"],
        }));

        const users: User[] = Array.from({ length: 25 }).map((_, i) => ({
          id: i + 1,
          firstName: `User`,
          lastName: `${i + 1}`,
          email: `user${i + 1}@example.com`,
          age: 20 + i,
          gender: i % 2 === 0 ? "male" : "female",
          username: `user${i + 1}`,
          password: "password",
          image: "https://placehold.co/50",
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

        const productsByCategory = Object.entries(categoryMap).map(
          ([name, value]) => ({ name, value }),
        );

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
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, stats, chartData, recentProducts };
}
