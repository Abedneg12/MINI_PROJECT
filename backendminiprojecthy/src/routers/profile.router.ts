import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';
import {
  updateMyProfileController,
  getCustomerProfileController, // tambahkan import baru
} from '../controllers/profile.controller';

const router = express.Router();

// Route 1: Untuk CUSTOMER - Data lengkap profil (poin, kupon, voucher)
router.get(
  '/me/customer',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  getCustomerProfileController
);

// Route 2: Update data profil
router.put(
  '/update',
  authMiddleware,
  updateMyProfileController
);

export default router;
