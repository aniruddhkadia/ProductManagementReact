import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Star, StarHalf, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Product } from "@/types/product.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/product.service";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductDetail = ({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProductDetailProps) => {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Sync main image when product changes
  useEffect(() => {
    if (product) {
      setMainImage(product.thumbnail);
    } else {
      setMainImage(null);
    }
  }, [product]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  if (!product) return null;

  const currentMainImage = mainImage || product.thumbnail;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "secondary" as const };
  };

  const stockStatus = getStockStatus(product.stock);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(product.id);
      onDelete(product.id); // Also trigger parent's onDelete if needed
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">
            Product Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {product.title}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{product.category}</Badge>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(product)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border bg-white flex items-center justify-center p-4">
              <img
                src={currentMainImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[product.thumbnail, ...product.images]
                .slice(0, 5)
                .map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      currentMainImage === img
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">
                ₹{Number(product.price).toFixed(2)}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  {product.discountPercentage}% OFF
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-muted-foreground">
                ({product.rating} / 5.0)
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card className="bg-muted/50 border-none shadow-none">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Brand
                  </p>
                  <p className="font-medium">{product.brand}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Stock
                  </p>
                  <p className="font-medium">{product.stock} units</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetail;
