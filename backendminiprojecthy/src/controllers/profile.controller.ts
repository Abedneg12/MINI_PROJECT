import { Request, Response } from 'express';
import {
  updateMyProfile,
  getCustomerProfileService,
} from '../services/profile.service';
import { successResponse, errorResponse } from '../utils/response';
import { uploadToCloudinary } from '../utils/cloudinary';
import { AuthRequest } from '../middlewares/auth';

// untuk CUSTOMER 
export const getCustomerProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    const profile = await getCustomerProfileService(userId);
    successResponse(res, profile, 'Berhasil mengambil profil customer');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal mengambil profil customer', 500);
  }
};


export const uploadProfilePictureController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'File tidak ditemukan' });
      return;
    }

    const { secure_url } = await uploadToCloudinary(req.file.buffer);

    await updateMyProfile(req.user!.id, {
      profile_picture: secure_url,
    });

    res.status(200).json({ success: true, message: 'Foto profil berhasil diunggah' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal upload foto', error });
  }
};


// Update profil biasa (bisa untuk CUSTOMER dan ORGANIZER)
export const updateMyProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await updateMyProfile(req.user!.id, req.body);
    successResponse(res, updatedUser, 'Profil berhasil diperbarui');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal memperbarui profil', 500);
  }
};


