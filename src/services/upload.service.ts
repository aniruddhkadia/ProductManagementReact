import axios from "axios";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config/constants";

import { toast } from "sonner";

const CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentage);
          }
        },
      },
    );
    return response.data.secure_url;
  } catch (error) {
    toast.error("Failed to upload image to Cloudinary");
    throw new Error("Failed to upload image to Cloudinary");
  }
};
