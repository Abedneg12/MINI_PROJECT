import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import { updateMyProfileController, getCustomerProfileController, uploadProfilePictureController} from '../controllers/profile.controller';
import { upload } from '../utils/multer';




const router = express.Router();

// Route 1: Untuk CUSTOMER - Data lengkap profil (poin, kupon, voucher)
router.get(
  '/me/customer',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  getCustomerProfileController
);

router.put(
  '/customer/upload',
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  upload.single('profile_picture'), // key harus sama dengan form-data
  uploadProfilePictureController
);

// Route 2: Update data profil
router.put(
  '/update',
  authMiddleware,
  updateMyProfileController
);

export default router;
