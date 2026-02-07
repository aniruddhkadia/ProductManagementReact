import { useNavigate, useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/productService";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for view/delete
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[] | null>(null);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const limit = 10;
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
      alert("Failed to delete product. Rolling back.");
    },
    onSuccess: () => {
      alert("Product deleted successfully!");
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

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleBulkDelete = (ids: number[]) => {
    setBulkDeleteIds(ids);
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
        alert(`Successfully deleted ${bulkDeleteIds.length} products`);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } catch (error) {
        alert("Failed to delete some products");
      } finally {
        setBulkDeleteIds(null);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory and product listings.
          </p>
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
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{skip + 1}</span> to{" "}
            <span className="font-medium">{Math.min(skip + limit, total)}</span>{" "}
            of <span className="font-medium">{total}</span> products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Simple pagination display: current page and surroundings
                let pageNum = page;
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
      <ProductDetail
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={(prod) => {
          setViewProduct(null);
          handleEdit(prod);
        }}
        onDelete={(id) => {
          setViewProduct(null);
          handleDelete(id);
        }}
      />

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
