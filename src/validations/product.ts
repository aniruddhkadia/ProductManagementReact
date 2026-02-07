import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  discountPercentage: z.coerce.number().min(0).max(100).optional().default(0),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  thumbnail: z
    .string()
    .url("Thumbnail URL is required")
    .or(z.string().min(1, "Thumbnail is required")),
  images: z.array(z.string().url()).optional().default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
