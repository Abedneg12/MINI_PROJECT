import express from 'express';
import {
  deleteProfilePictureController,
  getCustomerProfileController,
  updateMyProfileController,
  uploadProfilePictureController,
  getOrganizerProfileController, // ✅ tambahkan
} from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { Multer } from '../utils/multer';

const router = express.Router();



router.get(
  '/me/customer',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  getCustomerProfileController
);

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


router.get(
  '/me/organizer',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  getOrganizerProfileController
);

router.patch(
  '/organizer/upload-picture',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  Multer('memoryStorage').single('profile_picture'),
  uploadProfilePictureController
);

router.patch(
  '/organizer/delete-picture',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  deleteProfilePictureController
);


router.put('/update', authMiddleware, updateMyProfileController);

export default router;
