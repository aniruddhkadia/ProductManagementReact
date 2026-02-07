export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://dummyjson.com";

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "demo";
export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";

export const PAGINATION_LIMITS = [10, 20, 50];
export const DEFAULT_PAGE_SIZE = 10;
