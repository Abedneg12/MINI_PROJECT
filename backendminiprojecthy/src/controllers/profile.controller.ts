import { Request, Response } from 'express';
import { getMyProfile, updateMyProfile } from '../services/profile.service';
import { successResponse, errorResponse } from '../utils/response';

export const getMyProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getMyProfile(req.user!.id);
    successResponse(res, user, 'Data profil berhasil diambil');
  } catch (err: any) {
    errorResponse(res, err.message || 'Gagal mengambil profil', 500);
  }
};

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
