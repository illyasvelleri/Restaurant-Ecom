import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export async function uploadImage(file) {
  if (!file) return null;
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'restaurant-products', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer || file);
    });
    return result.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}
