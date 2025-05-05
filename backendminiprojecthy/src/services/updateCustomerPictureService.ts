import prisma from '../lib/prisma';
import { cloudinaryUpload, cloudinaryRemove } from '../utils/cloudinary';

export async function updateCustomerPictureService(userId: number, file: Express.Multer.File) {
  let uploadedUrl = '';

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User tidak ditemukan');

    // ⬅️ Upload dulu di luar transaction
    const { secure_url } = await cloudinaryUpload(file);
    uploadedUrl = secure_url;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { profile_picture: secure_url },
      });
    });

    return { message: 'Foto profil berhasil diupdate', secure_url };
  } catch (error) {
    if (uploadedUrl) await cloudinaryRemove(uploadedUrl); // rollback file jika error
    throw error;
  }
}

