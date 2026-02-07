import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentProducts } from "@/components/dashboard/RecentProducts";

export default function DashboardPage() {
  const { stats, chartData, recentProducts, loading } = useDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Overview of your store's performance
        </div>
      </div>

      <DashboardStats stats={stats} loading={loading} />

      <DashboardCharts data={chartData} loading={loading} />

      <RecentProducts products={recentProducts} loading={loading} />
    </div>
  );
}
