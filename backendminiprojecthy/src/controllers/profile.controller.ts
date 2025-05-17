import { Response } from 'express';
import {
  updateMyProfile,
  getCustomerProfileService,
  getOrganizerProfileService,
} from '../services/profile.service';
import { successResponse, errorResponse } from '../utils/response';
import { updatePictureService } from '../services/updateCustomerPictureService';
import { AuthRequest } from '../middlewares/auth'; 
import { deleteCustomerPictureService } from '../services/deleteCustomerPictureService';

// Ambil Data Profile Customer
export const getCustomerProfileController = async (
  req: AuthRequest,
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

// Ambil Data Profile Organizer
export const getOrganizerProfileController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    const profile = await getOrganizerProfileService(userId);
    successResponse(res, profile, 'Berhasil mengambil profil organizer');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal mengambil profil organizer', 500);
  }
};

// Upload Foto Profil
export const uploadProfilePictureController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    if (!req.file) {
      errorResponse(res, 'File tidak ditemukan', 400);
      return;
    }

    const result = await updatePictureService(userId, req.file);

    successResponse(res, { url: result.secure_url }, result.message);
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal upload foto', 500);
  }
};

// Hapus Foto Profil
export const deleteProfilePictureController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await deleteCustomerPictureService(userId);
    res.status(200).json({ success: true, message: result.message });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Gagal menghapus foto profil',
    });
  }
};

// Update Profil
export const updateMyProfileController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await updateMyProfile(req.user!.id, req.body);
    successResponse(res, updatedUser, 'Profil berhasil diperbarui');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal memperbarui profil', 500);
  }
};
