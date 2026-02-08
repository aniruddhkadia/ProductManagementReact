import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import productService from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  StarHalf,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  // Update main image when product loads
  useState(() => {
    if (product) {
      setMainImage(product.thumbnail);
    }
  });

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
    if (stock < 10) return { label: "Low Stock", variant: "default" as const };
    return { label: "In Stock", variant: "secondary" as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg text-muted-foreground">Product not found</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const currentMainImage = mainImage || product.thumbnail;
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden border bg-white flex items-center justify-center p-8">
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

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Badges */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{product.category}</Badge>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              ₹{product.price}
            </div>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-green-600 font-medium">
                {product.discountPercentage}% OFF
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              ({product.rating} / 5.0)
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => navigate(`/products/edit/${product.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Product
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (confirm("Are you sure you want to delete this product?")) {
                  // Handle delete - will implement with mutation
                  navigate("/products");
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/50 border-none shadow-none">
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Brand
                </p>
                <p className="font-medium text-lg">{product.brand}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Stock
                </p>
                <p className="font-medium text-lg">{product.stock} units</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
