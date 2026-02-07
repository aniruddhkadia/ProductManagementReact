import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { useCategories } from "@/hooks/use-products";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/services/upload.service";
import { Progress } from "@/components/ui/progress";

interface ProductFormProps {
  initialData?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isLoading: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const { data: categories } = useCategories();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail || null,
  );
  const [imagesPreviews, setImagesPreviews] = useState<string[]>(
    initialData?.images || [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discountPercentage: 0,
      stock: 0,
      brand: "",
      category: "",
      thumbnail: "",
      images: [],
      ...initialData,
    },
  });

  const selectedCategory = watch("category");

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG and WebP images are allowed.");
      return false;
    }
    if (file.size > maxSize) {
      setUploadError("Image size must be less than 5MB.");
      return false;
    }
    return true;
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFile(file)) return;

      setUploadError(null);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const url = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });
        setThumbnailPreview(url);
        setValue("thumbnail", url, { shouldValidate: true });
      } catch (error) {
        setUploadError("Failed to upload thumbnail.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadError(null);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) continue;

        setIsUploading(true);
        setUploadProgress(0);

        try {
          const url = await uploadToCloudinary(file, (progress) => {
            setUploadProgress(progress);
          });
          newUrls.push(url);
        } catch (error) {
          setUploadError(`Failed to upload one or more images.`);
        }
      }

      const updatedImages = [...(watch("images") || []), ...newUrls];
      setImagesPreviews(updatedImages);
      setValue("images", updatedImages, {
        shouldValidate: true,
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagesPreviews];
    newPreviews.splice(index, 1);
    setImagesPreviews(newPreviews);
    setValue("images", newPreviews, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              placeholder="e.g. iPhone 15 Pro"
              {...register("title")}
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Detailed product description..."
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                errors.description && "border-destructive",
              )}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                className={cn(errors.price && "border-destructive")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                step="0.01"
                {...register("discountPercentage")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock")}
                className={cn(errors.stock && "border-destructive")}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">
                  {errors.stock.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g. Apple"
                {...register("brand")}
                className={cn(errors.brand && "border-destructive")}
              />
              {errors.brand && (
                <p className="text-xs text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setValue("category", value, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "w-full capitalize",
                  errors.category && "border-destructive",
                  !selectedCategory && "text-muted-foreground",
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem
                    key={cat.slug}
                    value={cat.slug}
                    className="capitalize"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Images */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Product Thumbnail</Label>
            {uploadError && (
              <p className="text-sm font-medium text-destructive px-3 py-2 bg-destructive/10 rounded-md border border-destructive/20">
                {uploadError}
              </p>
            )}
            <div
              className={cn(
                "relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 transition-colors hover:bg-muted/50 overflow-hidden",
                errors.thumbnail && "border-destructive",
              )}
            >
              {isUploading && (
                <div className="absolute inset-0 z-10 bg-background/80 flex flex-col items-center justify-center p-6 text-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium mb-4">
                    Uploading to Cloudinary...
                  </p>
                  <Progress value={uploadProgress} className="w-full h-2" />
                  <span className="text-xs text-muted-foreground mt-2">
                    {uploadProgress}%
                  </span>
                </div>
              )}
              {thumbnailPreview ? (
                <>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={() => {
                      setThumbnailPreview(null);
                      setValue("thumbnail", "");
                    }}
                  >
                    <X size={16} />
                  </Button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-6">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">
                    Click to upload thumbnail
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Required. JPG, PNG or WebP.
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                </label>
              )}
            </div>
            {errors.thumbnail && (
              <p className="text-xs text-destructive">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Product Gallery</Label>
              <label className="text-primary text-sm font-medium cursor-pointer hover:underline flex items-center gap-1">
                <Plus size={14} /> Add Images
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*"
                  onChange={handleImagesUpload}
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {isUploading && !thumbnailPreview && (
                <div className="col-span-3 space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span>Uploading gallery images...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}
              {imagesPreviews.map((src, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-lg border bg-muted overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="text-white h-5 w-5" />
                  </button>
                </div>
              ))}
              {imagesPreviews.length === 0 && !isUploading && (
                <div className="col-span-3 h-24 rounded-lg border border-dashed flex items-center justify-center bg-muted/20 text-muted-foreground text-xs italic">
                  No additional images added
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t font-semibold">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </form>
  );
}
