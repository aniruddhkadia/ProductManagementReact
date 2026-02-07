import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/product.service";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { toast } from "sonner";

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for delete
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Sync filters with URL for consistency
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Dashboard shows top 5 recent/filtered products
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: 5,
    skip: 0,
    search,
    category,
  });

  // Use dashboard hook for stats and charts only
  const { stats, chartData, loading: statsLoading } = useDashboardData();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onSettled: () => {
      setDeleteId(null);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("search", value);
      else prev.delete("search");
      return prev;
    });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("category", value);
      else prev.delete("category");
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
        </div>
      </div>

      <DashboardStats stats={stats} loading={statsLoading} />
      <DashboardCharts data={chartData} loading={statsLoading} />

      <div className="space-y-6 pt-6 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Products
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your product listings directly from the dashboard.
            </p>
          </div>
          <Button asChild className="gap-2 shrink-0">
            <Link to="/products">
              View All Products <ArrowRight size={18} />
            </Link>
          </Button>
        </div>

        <ProductFilters
          search={search}
          category={category}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={clearFilters}
        />

        <ProductTable
          products={productsData?.products || []}
          loading={productsLoading}
          onView={(product) => navigate(`/products/${product.id}`)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
