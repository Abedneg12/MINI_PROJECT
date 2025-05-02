import { Request, Response } from 'express';
import {
  updateMyProfile,
  getCustomerProfileService,
} from '../services/profile.service';
import { successResponse, errorResponse } from '../utils/response';

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
