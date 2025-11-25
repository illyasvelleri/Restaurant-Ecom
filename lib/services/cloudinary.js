import { v2 as cloudinary } from 'cloudinary';

// Configure once
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file) {
  if (!file) return null;

  // If you're using Next.js App Router + uploadthing/multer/etc., file is a File/Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'restaurant/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // prevent huge uploads
          { quality: 'auto:good' },
          { format: 'webp' }, // modern format = smaller size
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

// Optional: delete image from Cloudinary when product is deleted
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Failed to delete image from Cloudinary:', err);
  }
}