import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role'; // ⬅️ import middleware role
import {
  getMyProfileController,
  updateMyProfileController,
} from '../controllers/profile.controller';

const router = express.Router();

// 🔒 Hanya CUSTOMER yang bisa akses profil
router.get(
  '/me',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  getMyProfileController
);

router.put(
  '/update',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  updateMyProfileController
);

export default router;
