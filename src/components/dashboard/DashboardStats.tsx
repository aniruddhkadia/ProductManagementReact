import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  Star,
  Layers,
} from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalProducts: number;
    totalUsers: number;
    lowStockItems: number;
    averagePrice: number;
    averageRating: number;
    categoriesCount: number;
  };
  loading: boolean;
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-500",
      description: "Total items in catalog",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-500",
      description: "Registered customers",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: "text-red-500",
      description: "Stock count < 10",
    },
    {
      title: "Average Price",
      value: `₹${stats.averagePrice}`,
      icon: DollarSign,
      color: "text-green-500",
      description: "Across all products",
    },
    {
      title: "Average Rating",
      value: stats.averageRating,
      icon: Star,
      color: "text-yellow-500",
      description: "Customer satisfaction",
    },
    {
      title: "Categories",
      value: stats.categoriesCount,
      icon: Layers,
      color: "text-indigo-500",
      description: "Product categories",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
