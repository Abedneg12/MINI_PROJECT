import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
export const uploadToCloudinary = (fileBuffer: Buffer): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile_pictures' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
