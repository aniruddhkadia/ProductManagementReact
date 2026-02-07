import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Package, Truck, ShieldCheck, Edit, Trash } from "lucide-react";
import type { Product } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductDetail({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ProductDetailProps) {
  const [mainImage, setMainImage] = useState<string | null>(null);

  if (!product) return null;

  const currentMainImage = mainImage || product.thumbnail;

  const stockStatus =
    product.stock === 0
      ? {
          label: "Out of Stock",
          color: "bg-destructive/10 text-destructive border-destructive/20",
        }
      : product.stock < 10
        ? {
            label: "Low Stock",
            color:
              "bg-warning/10 text-warning border-warning/20 text-orange-500 border-orange-200",
          }
        : {
            label: "In Stock",
            color:
              "bg-success/10 text-success border-success/20 text-green-600 border-green-200",
          };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-2xl font-bold">
            {product.title}
          </SheetTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
            <Badge className={cn("border font-medium", stockStatus.color)}>
              {stockStatus.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl border bg-muted/30 overflow-hidden shadow-inner">
              <img
                src={currentMainImage}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[product.thumbnail, ...product.images].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={cn(
                      "w-20 h-20 rounded-lg border bg-card shrink-0 overflow-hidden transition-all",
                      currentMainImage === img
                        ? "ring-2 ring-primary border-transparent"
                        : "hover:border-primary/50",
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Rating */}
          <div className="flex justify-between items-end bg-accent/50 p-4 rounded-xl border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm line-through text-muted-foreground">
                    ₹
                    {Math.round(
                      product.price * (1 + product.discountPercentage / 100),
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-lg border border-border">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
            </div>
          </div>

          {/* Brand & Stock Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Brand
                </p>
                <p className="font-medium">{product.brand}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Package size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Stock
                </p>
                <p className="font-medium">{product.stock} units</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">About this product</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features / Benefits */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <Truck size={18} className="text-primary" />
              <span>Free delivery available on orders over ₹2000</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button className="flex-1 gap-2" onClick={() => onEdit(product)}>
              <Edit size={18} /> Edit Product
            </Button>
            <Button
              variant="destructive"
              className="px-6"
              onClick={() => onDelete(product.id)}
            >
              <Trash size={18} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
