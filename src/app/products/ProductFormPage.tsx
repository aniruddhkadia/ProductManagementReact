import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProduct } from "@/hooks/use-products";
import productService from "@/services/product.service";
import ProductForm from "@/components/products/ProductForm";
import type { ProductFormValues } from "@/lib/validations";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      toast.success("Product added successfully!");
      navigate("/products");
    },
    onError: (error) => {
      toast.error("Failed to add product: " + (error as any).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      productService.updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product updated successfully!");
      navigate("/products");
    },
    onError: (error) => {
      toast.error("Failed to update product: " + (error as any).message);
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
    <div className="max-w-5xl mx-auto space-y-6">
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
