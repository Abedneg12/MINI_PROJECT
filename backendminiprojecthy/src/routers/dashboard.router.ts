import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { organizerOnly } from '../middlewares/rolecheck';
import { AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', authMiddleware, organizerOnly, (req, res) => {
  const authReq = req as AuthRequest;

  res.status(200).json({
    success: true,
    message: 'Welcome to Organizer Dashboard',
    user: authReq.user, // akses aman dari custom type
  });
});

export default router;
