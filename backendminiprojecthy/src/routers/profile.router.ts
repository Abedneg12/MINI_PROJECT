import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
  getMyProfileController,
  updateMyProfileController,
} from '../controllers/profile.controller';

const router = express.Router();

router.get('/me', authMiddleware, getMyProfileController);
router.put('/update', authMiddleware, updateMyProfileController);

export default router;