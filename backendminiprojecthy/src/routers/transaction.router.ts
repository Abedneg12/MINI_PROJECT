import express from 'express';
import { createTransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  roleMiddleware('CUSTOMER'),
  createTransactionController
);

export default router;
