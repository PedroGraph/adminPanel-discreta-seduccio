const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UploadedImage {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

export interface UploadResponse {
  success: boolean;
  data: UploadedImage | { images: UploadedImage[]; count: number };
  message: string;
}

/**
 * Upload a single image to Cloudinary
 */
export const uploadSingleImage = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${API_URL}/upload/single`, {
    method: 'POST',
    credentials: 'include', // Send cookies for authentication
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir la imagen');
  }

  const result: UploadResponse = await response.json();
  return result.data as UploadedImage;
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleImages = async (files: File[]): Promise<UploadedImage[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await fetch(`${API_URL}/upload/multiple`, {
    method: 'POST',
    credentials: 'include', // Send cookies for authentication
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al subir las imágenes');
  }

  const result: UploadResponse = await response.json();
  const data = result.data as { images: UploadedImage[]; count: number };
  return data.images;
};

/**
 * Delete an image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/upload/delete`, {
    method: 'DELETE',
    credentials: 'include', // Send cookies for authentication
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la imagen');
  }
};
