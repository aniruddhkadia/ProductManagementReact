import { useNavigate, useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/use-products";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product.types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/product.service";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useUIStore } from "@/stores/uiStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for view/delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[] | null>(null);

  const { pageSize, setPageSize } = useUIStore();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const limit = parseInt(searchParams.get("limit") || pageSize.toString());
  const skip = (page - 1) * limit;

  const { data, isLoading } = useProducts({ limit, skip, search, category });

  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Delete Mutation with Optimistic Update
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData([
        "products",
        { limit, skip, search, category },
      ]);

      queryClient.setQueryData(
        ["products", { limit, skip, search, category }],
        (old: any) => ({
          ...old,
          products: old.products.filter((p: Product) => p.id !== id),
          total: old.total - 1,
        }),
      );

      return { previousProducts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["products", { limit, skip, search, category }],
        context?.previousProducts,
      );
      toast.error("Failed to delete product. Rolling back.");
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("search", value);
      else prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleCategoryChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) prev.set("category", value);
      else prev.delete("category");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setPageSize(newLimit);
    setSearchParams((prev) => {
      prev.set("limit", value);
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
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

  const confirmDelete = async () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }

    if (bulkDeleteIds) {
      // Dummyjson doesn't have bulk delete, so we loop
      // In a real app, we'd have a specific bulk delete endpoint
      try {
        await Promise.all(
          bulkDeleteIds.map((id) => productService.deleteProduct(id)),
        );
        toast.success(`Successfully deleted ${bulkDeleteIds.length} products`);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } catch (error) {
        toast.error("Failed to delete some products");
      } finally {
        setBulkDeleteIds(null);
      }
    }
  };

  return (
    <div className=" max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        </div>
        <Button asChild className="gap-2">
          <Link to="/products/add">
            <Plus size={18} /> Add Product
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
        products={data?.products || []}
        loading={isLoading}
        onView={(product) => navigate(`/products/${product.id}`)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {(totalPages > 1 || limit !== pageSize) && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="order-2 md:order-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Showing{" "}
              <span className="font-medium">{total === 0 ? 0 : skip + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(skip + limit, total)}
              </span>{" "}
              of <span className="font-medium">{total}</span> products
            </p>
          </div>

          <div className="flex items-center gap-3 order-1 md:order-2">
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-[70px] h-9">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((v) => (
                  <SelectItem key={v} value={v.toString()}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <span className="text-sm font-medium mx-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteId || !!bulkDeleteIds}
        onClose={() => {
          setDeleteId(null);
          setBulkDeleteIds(null);
        }}
        onConfirm={confirmDelete}
        title={bulkDeleteIds ? "Bulk Delete Products" : "Delete Product"}
        description={
          bulkDeleteIds
            ? `Are you sure you want to delete ${bulkDeleteIds.length} products? This action cannot be undone.`
            : "Are you sure you want to delete this product? This action cannot be undone."
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
