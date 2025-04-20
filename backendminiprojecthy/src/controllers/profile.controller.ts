import { Request, Response } from 'express';
import { getMyProfile, updateMyProfile } from '../services/profile.service';

export const getMyProfileController = async (req: Request, res: Response) => {
  try {
    const user = await getMyProfile(req.user!.id);
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMyProfileController = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateMyProfile(req.user!.id, req.body);
    res.status(200).json({ success: true, message: 'Profile updated', data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
