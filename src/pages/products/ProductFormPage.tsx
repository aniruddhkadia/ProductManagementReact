import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProduct } from "@/hooks/useProducts";
import productService from "@/services/productService";
import ProductForm from "@/components/products/ProductForm";
import type { ProductFormValues } from "@/validations/product";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: product, isLoading: isFetching } = useProduct(id || "");

  const addMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      productService.addProduct({ ...data, rating: 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Product added successfully!"); // In a real app, use a toast
      navigate("/products");
    },
    onError: (error) => {
      alert("Failed to add product: " + (error as any).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      productService.updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      alert("Product updated successfully!");
      navigate("/products");
    },
    onError: (error) => {
      alert("Failed to update product: " + (error as any).message);
    },
  });

  const handleSubmit = (data: ProductFormValues) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      addMutation.mutate(data);
    }
  };

  if (isEdit && isFetching) {
    return (
      <div className="p-8 text-center animate-pulse">
        Loading product data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
          className="rounded-full"
        >
          <ChevronLeft size={24} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Modify the details of your existing product."
              : "Fill in the details to add a new product to your inventory."}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 md:p-8 shadow-sm">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={addMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
}
