import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware} from '../middlewares/role';
import { AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/dashboard', authMiddleware, roleMiddleware('ORGANIZER'), (req, res) => {
  const authReq = req as AuthRequest;

  res.status(200).json({
    success: true,
    message: 'Welcome to Organizer Dashboard',
    user: authReq.user, 
  });
});

export default router;
