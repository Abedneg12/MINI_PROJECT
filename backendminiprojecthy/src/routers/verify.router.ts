import express from 'express';
import { verifyEmailController } from '../controllers/verify.controller';

const router = express.Router();

router.get('/verify', verifyEmailController);

export default router;
