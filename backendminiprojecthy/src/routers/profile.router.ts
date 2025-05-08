import express from 'express';
import {
  deleteProfilePictureController,
  getCustomerProfileController,
  updateMyProfileController,
  uploadProfilePictureController,
  resetPasswordController
} from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { Multer } from '../utils/multer';

const router = express.Router();

router.patch(
  '/reset-password',
  authMiddleware,
  resetPasswordController
);

// GET Profil Customer
router.get(
  '/me/customer',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  getCustomerProfileController
);

// PUT Update Profil Customer
router.put(
  '/update',
  authMiddleware,
  updateMyProfileController
);

// PATCH Upload Foto Profil Customer
router.patch(
  '/customer/upload-picture',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  Multer('memoryStorage').single('profile_picture'),
  uploadProfilePictureController
);


router.patch(
  '/customer/delete-picture',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  deleteProfilePictureController
);


export default router;
